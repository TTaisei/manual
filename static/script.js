const format = (template, ...args) => {
    var is_d = new RegExp(/^\d+$/);
    var rtn = "";
    var is_change = false;

    template.split(/({|})/).forEach( value => {
        if (value == "{") {
            is_change = !is_change;
            if (!is_change) {
                rtn = rtn + value;
            }
        } else if (is_change && is_d.test(value)) {
            rtn = rtn + args[value];
        } else if (is_change && value == "}") {
            is_change = false;
        } else if (!is_change && value == "}") {
            is_change = true;
            rtn = rtn + value;
        } else {
            rtn = rtn + value;
        }
    });

    return rtn;
};

const addOlToLi = (ol, id, innerHTML) => {
    var li = document.createElement("li");
    li.innerHTML = format(
        "<a href='#{0}'>{1}</a>",
        id,
        innerHTML
    );
    ol.appendChild(li);
};

const contents = () => {
    var hs = document.querySelectorAll("h1, h2, h3");
    var contents = document.getElementById("contents");
    // contents.style.pageBreakAfter = "always";
    contents.classList.add("section");

    var preTagName = "h1";
    var ids = new Map();
    var id = "";
    for (var h of hs) {
        if (h.className == "not-contents") continue;

        if (ids.has(h.id)) {
            ids.set(h.id, ids.get(h.id)+1);
            id = format("{0}-{1}", h.id, ids.get(h.id));
            h.id = id;
        } else {
            ids.set(h.id, 0);
            id = h.id;
        }

        if (h.tagName == "H1") {
            addOlToLi(contents, id, h.innerHTML);
        } else if (h.tagName == "H2") {
            if (preTagName != "H2") {
                var ol2 = document.createElement("ol");
                ol2.classList.add("subsection");
                contents.appendChild(ol2);
            }
            addOlToLi(ol2, id, h.innerHTML);
        } else {
            if (preTagName != "H3") {
                var ol3 = document.createElement("ol");
                ol3.classList.add("subsubsection");
                ol2.appendChild(ol3);
            }
            addOlToLi(ol3, id, h.innerHTML);
        }

        preTagName = h.tagName;
    }
};

const date = () => {
    var today = new Date();
    var dateDisplay = document.getElementById("date");

    dateDisplay.innerHTML = format(
        "{0}-{1}-{2} 版",
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    );
};
