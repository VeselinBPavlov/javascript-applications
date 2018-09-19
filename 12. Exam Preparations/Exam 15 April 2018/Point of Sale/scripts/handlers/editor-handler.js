handlers.getEditor = async function (ctx) {
    try {
        const userId = sessionStorage.getItem('userId');
        let [ receipt ] = await receiptService.getActive(userId);
        if (!receipt) {
            receipt = await receiptService.create();
        }

        let entries = await entriesService
            .getAllByReceiptId(receipt._id);

        if (entries.length > 0) {
            entries.forEach((e) => {
                e.subtotal = (e.quantity * e.price).toFixed(2)
            });

            ctx.productsCount = entries.length;
            ctx.total = entries
                .map(e => +e.subtotal)
                .reduce((a, b) => a + b)
                .toFixed(2);
        } else {
            ctx.total = 0;
            ctx.productsCount = 0;
        }
        ctx.entries = entries;
        ctx.receiptId = receipt._id;
        ctx.username = sessionStorage.getItem('username');
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            checkoutForm: './templates/forms/checkout.hbs',
            entryForm: './templates/forms/entry-form.hbs',
            entry: './templates/editor/entry.hbs'
        }).then(function () {
            this.partial('./templates/editor/editor-page.hbs');
        })

    } catch (err) {
        notify.handleError(err);
    }
};
handlers.createEntry = function (ctx) {
    const receiptId = ctx.params.receiptId;
    const type = ctx.params.type;
    const quantity = ctx.params.quantity;
    const price = ctx.params.price;

    if (type.length === 0) {
        notify.showError('Product name must be non-empty string!');
    } else if (isNaN(+quantity) || quantity.length === 0) {
        notify.showError('Quantity must be a number!');
    } else if (isNaN(+price) || price.length === 0) {
        notify.showError('Price must be a number!');
    } else {
        entriesService.create(type, quantity, price, receiptId)
            .then(() => {
                notify.showInfo('Entry added!');
                ctx.redirect('#/editor');
            })
            .catch(notify.handleError);
    }
};
handlers.deleteEntry = function (ctx) {
  const entryId = ctx.params.entryId;

  entriesService.remove(entryId)
      .then(() => {
        notify.showInfo('Entry deleted.');
        ctx.redirect('#/editor');
      })
      .catch(notify.handleError);
};
handlers.checkout = function (ctx) {
    const receiptId = ctx.params.receiptId;
    const productsCount = +ctx.params.productsCount;
    const total = +ctx.params.total;

    if(productsCount === 0) {
        notify.showError('Cannot checkout without any products!');
    } else {
        receiptService.checkout(receiptId, productsCount, total)
            .then(() => {
                notify.showInfo('Receipt checked out!');
                ctx.redirect('#/editor');
            })
            .catch(notify.handleError);
    }
};