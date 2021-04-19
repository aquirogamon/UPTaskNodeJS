require('dhtmlx-gantt')
const gantt_here = document.querySelector('#gantt_here');

gantt.config.columns = [{
        name: "text",
        label: "Tarea",
        width: "200",
        tree: true
    },
    {
        name: "start_date",
        label: "Inicio",
        align: "center"
    },
    {
        name: "duration",
        label: "Duración",
        align: "center"
    },
    {
        name: "add",
        label: "",
        width: 44
    }
];

var resourceConfig = {
    scale_height: 30
};

gantt.config.scale_unit = "day";
gantt.config.step = 5;
gantt.config.scale_height = 100;
gantt.config.min_column_width = 40;
gantt.config.scale_height = 50;
gantt.init(gantt_here);
gantt.load("/diagrama-gantt/data");