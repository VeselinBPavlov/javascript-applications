async function attachEvents() {
    const INPUT = $('#towns');
    const ROOT = $('#root');
    const LOAD_BTN = $('#btnLoadTowns');

    const TOWNS_HTML = await $.get('./template.hbs');
    let townsTemplate = Handlebars.compile(TOWNS_HTML);

    LOAD_BTN.on('click', () => {
        let townsStr = INPUT.val();
        let townsArr = townsStr.split(', ');
        let towns = { towns: []};
        for (let town of townsArr) {
            towns.towns.push({town:town});
        }
        let resultHtml = townsTemplate(towns);
        ROOT.append(resultHtml);
    });
}