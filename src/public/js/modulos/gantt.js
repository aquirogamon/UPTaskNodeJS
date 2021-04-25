require('dhtmlx-gantt')
const gantt_here = document.querySelector('#gantt_here');
const axios = require('axios');

if (gantt_here) {

    var resourceConfig = {
        scale_height: 30
    };

    gantt.config.scale_unit = "day";
    // gantt.config.step = 1;
    gantt.config.scale_height = 100;
    gantt.config.min_column_width = 40;
    gantt.config.scale_height = 50;

    function calculateResourceLoad(tasks, scale) {
        var step = scale.unit;
        var timegrid = {};

        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];

            var currDate = gantt.date[step + "_start"](new Date(task.start_date));

            while (currDate < task.end_date) {

                var date = currDate;
                currDate = gantt.date.add(currDate, 1, step);

                if (!gantt.isWorkTime({
                        date: date,
                        task: task
                    })) {
                    continue;
                }

                var timestamp = date.valueOf();
                if (!timegrid[timestamp])
                    timegrid[timestamp] = 0;

                timegrid[timestamp] += 8;
            }
        }

        var timetable = [];
        var start, end;
        for (var i in timegrid) {
            start = new Date(i * 1);
            end = gantt.date.add(start, 1, step);
            timetable.push({
                start_date: start,
                end_date: end,
                value: timegrid[i]
            });
        }

        return timetable;
    }


    var renderResourceLine = function (resource, timeline) {
        var tasks = gantt.getTaskBy("user", resource.id);
        var timetable = calculateResourceLoad(tasks, timeline.getScale());

        var row = document.createElement("div");

        for (var i = 0; i < timetable.length; i++) {

            var day = timetable[i];

            var css = "";
            if (day.value <= 8) {
                css = "gantt_resource_marker gantt_resource_marker_ok";
            } else {
                css = "gantt_resource_marker gantt_resource_marker_overtime";
            }

            var sizes = timeline.getItemPosition(resource, day.start_date, day.end_date);
            var el = document.createElement('div');
            el.className = css;

            el.style.cssText = [
                'left:' + sizes.left + 'px',
                'width:' + sizes.width + 'px',
                'position:absolute',
                'height:' + (gantt.config.row_height - 1) + 'px',
                'line-height:' + sizes.height + 'px',
                'top:' + sizes.top + 'px'
            ].join(";");

            el.innerHTML = day.value;
            row.appendChild(el);
        }
        return row;
    };

    var resourceLayers = [
        renderResourceLine,
        "taskBg"
    ];

    var mainGridConfig = {
        columns: [{
                name: "text",
                lavel: "Tarea",
                tree: true,
                width: 200,
                resize: true
            },
            {
                name: "start_date",
                label: "Inicio",
                align: "center",
                width: 80,
                resize: true
            },
            {
                name: "owner",
                align: "center",
                width: 60,
                label: "Owner",
                template: function (task) {
                    var store = gantt.getDatastore("resources");
                    var owner = store.getItem(task.user);
                    if (owner) {
                        return owner.label;
                    } else {
                        return "N/A";
                    }
                }
            },
            {
                name: "duration",
                label: "Duración",
                width: 50,
                align: "center"
            },
            {
                name: "add",
                label: "",
                width: 44
            }
        ]
    };

    var resourcePanelConfig = {
        columns: [{
                name: "name",
                label: "Name",
                template: function (resource) {
                    return resource.label;
                }
            },
            {
                name: "workload",
                label: "Workload",
                template: function (resource) {
                    var tasks = gantt.getTaskBy("user", resource.id);

                    var totalDuration = 0;
                    for (var i = 0; i < tasks.length; i++) {
                        totalDuration += tasks[i].duration;
                    }

                    return (totalDuration || 0) * 8 + "";
                }
            }
        ]
    };

    gantt.config.layout = {
        css: "gantt_container",
        rows: [{
                cols: [{
                        view: "grid",
                        group: "grids",
                        config: mainGridConfig,
                        scrollY: "scrollVer"
                    },
                    {
                        resizer: true,
                        width: 1,
                        group: "vertical"
                    },
                    {
                        view: "timeline",
                        id: "timeline",
                        scrollX: "scrollHor",
                        scrollY: "scrollVer"
                    },
                    {
                        view: "scrollbar",
                        id: "scrollVer",
                        group: "vertical"
                    }
                ]
            },
            {
                resizer: true,
                width: 1
            },
            {
                config: resourcePanelConfig,
                cols: [{
                        view: "grid",
                        id: "resourceGrid",
                        group: "grids",
                        bind: "resources",
                        scrollY: "resourceVScroll"
                    },
                    {
                        resizer: true,
                        width: 1,
                        group: "vertical"
                    },
                    {
                        view: "timeline",
                        id: "resourceTimeline",
                        bind: "resources",
                        bindLinks: null,
                        layers: resourceLayers,
                        scrollX: "scrollHor",
                        scrollY: "resourceVScroll"
                    },
                    {
                        view: "scrollbar",
                        id: "resourceVScroll",
                        group: "vertical"
                    }
                ]
            },
            {
                view: "scrollbar",
                id: "scrollHor"
            }
        ]
    };

    var resourcesStore = gantt.createDatastore({
        name: "resources",
        initItem: function (item) {
            item.id = item.key || gantt.uid();
            return item;
        }
    });

    var tasksStore = gantt.getDatastore("task");
    tasksStore.attachEvent("onStoreUpdated", function (id, item, mode) {
        resourcesStore.refresh();
    });

    gantt.init(gantt_here);

    axios.get('/diagrama-gantt/users')
        .then(function (response) {
            // handle success
            resourcesStore.parse(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    // resourcesStore.parse([{
    //         key: 1,
    //         label: 'Armando Quiroga'
    //     },
    //     {
    //         key: 2,
    //         label: 'Luz Zegarra'
    //     },
    //     {
    //         key: 3,
    //         label: 'Victor Ortiz'
    //     },
    //     {
    //         key: 4,
    //         label: 'Diana Rivera'
    //     },
    //     {
    //         key: 5,
    //         label: 'Caroline Medina'
    //     },
    //     {
    //         key: 6,
    //         label: 'Prueba'
    //     }
    // ]);

    gantt.load("/diagrama-gantt/data");
}