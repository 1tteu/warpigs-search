        function convertColors(text, isPeso = false) {
            if (isPeso) {
                return `<span style="color: #${text};">${text}</span>`;
            } else {
                return text.replace(/\^([0-9A-Fa-f]{6})/g, '<span style="color: #$1;">');
            }
        }

        $(document).ready(function () {
            function fetchData() {
                return fetch('itemlist.lub')
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        var decoder = new TextDecoder('ISO-8859-1');
                        var text = decoder.decode(new Uint8Array(buffer));
                        return parseData(text);
                    });
            }

            function parseData(data) {
                var formattedData = [];

                var patternInfo = /\[(\d+)\]\s*=\s*{\s*.*?identifiedDisplayName\s*=\s*"([^"]*)".*?identifiedDescriptionName\s*=\s*{([^}]+).*?slotCount\s*=\s*(\d+).*?ClassNum\s*=\s*(\d+)/gs;
                var matches;

                while (matches = patternInfo.exec(data)) {
                    var itemid = matches[1];
                    var itemName = matches[2];
                    var identifiedDescriptionName = matches[3];
                    var slotCount = matches[4];

                    var itemImage = '';
                    if (![1833].includes(parseInt(itemid))) {
                        itemImage = (itemid <= 30000) ? `<img src='https://static.ragnaplace.com/bro/collection/${itemid}.png' alt='Item Image' style='width:24px; height:24px;'>` : '';
                    }

                    formattedData.push({
                        itemid: itemid,
                        item: `<a href='https://ratemyserver.net/item_db.php?item_id=${itemid}&small=1&back=1' target='_blank'>${itemImage} ${convertColors(itemName)}</a>`,
                        identifiedDescriptionName: convertColors(identifiedDescriptionName),
                        slotCount: slotCount,
                        Classe: convertColors(extractAdditionalInfo(identifiedDescriptionName, 'Classe')),
                        'Força de Ataque': convertColors(extractAdditionalInfo(identifiedDescriptionName, 'Força de Ataque')),
                        Peso: convertColors(extractAndFormatPeso(identifiedDescriptionName)),
                    });
                }

                return formattedData;
            }

            function extractAdditionalInfo(description, key) {
                var pattern = new RegExp(`${key}: (.*?)(?="|$)`, 'g');
                var match = pattern.exec(description);
                return match ? match[1].trim() : '';
            }

            function extractAndFormatPeso(description) {
                var pattern = /Peso: \^777777(\d+)/g;
                var match = pattern.exec(description);
                if (match) {
                    var pesoValue = match[1];
                    var pesoWithColor = `<span style="color: #FF0000;">${pesoValue}</span>`;
                    return pesoWithColor;
                }
                return '';
            }

            function createTable(data) {
                var dataTable = $('#itemTable').DataTable({
                    data: data,
                    columns: [
                        { data: 'itemid' },
                        { data: 'item' },
                        { data: 'identifiedDescriptionName' },
                        { data: 'slotCount' },
                        { data: 'Classe' },
                        { data: 'Força de Ataque' },
                        { data: 'Peso',}
                    ]
                });

                dataTable.on('draw', function () {
                    $('#itemTable td:nth-child(2)').css('text-align', 'left');
                });
            }

            fetchData().then(createTable).catch(function (error) {
            });
        });