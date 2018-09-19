let receiptService = (() => {
    
    function getActive(userId) {
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"true"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function create() {
        const data = {
            active: true,
            productsCount: 0,
            total: 0
        };

        return remote.post('appdata', 'receipts', 'kinvey', data);
    }

    function getMyReceipts(userId) {
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getById(receiptId) {
        const endpoint = `receipts/${receiptId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    async function checkout(receiptId, productCount, total) {
        const endpoint = `receipts/${receiptId}`;
        let receipt = await getById(receiptId);
        receipt['active'] = false;
        receipt['productsCount'] = productCount;
        receipt['total'] = total;

        return remote.update('appdata', endpoint, 'kinvey', receipt);
    }
    
    return {
        getActive,
        create,
        getById,
        getMyReceipts,
        checkout
    }
})();