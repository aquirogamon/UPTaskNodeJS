require('dhtmlx-gantt')
const gantt_here = document.querySelector('#gantt_here');
const axios = require('axios');

if (gantt_here) {

    // var resourceConfig = {
    //     scale_height: 30
    // };

    // gantt.config.scale_unit = "day";
    // // gantt.config.step = 1;
    // gantt.config.scale_height = 100;
    // gantt.config.min_column_width = 40;
    // gantt.config.scale_height = 50;

    // function calculateResourceLoad(tasks, scale) {
    //     var step = scale.unit;
    //     var timegrid = {};

    //     for (var i = 0; i < tasks.length; i++) {
    //         var task = tasks[i];

    //         var currDate = gantt.date[step + "_start"](new Date(task.start_date));

    //         while (currDate < task.end_date) {

    //             var date = currDate;
    //             currDate = gantt.date.add(currDate, 1, step);

    //             if (!gantt.isWorkTime({
    //                     date: date,
    //                     task: task
    //                 })) {
    //                 continue;
    //             }

    //             var timestamp = date.valueOf();
    //             if (!timegrid[timestamp])
    //                 timegrid[timestamp] = 0;

    //             timegrid[timestamp] += 8;
    //         }
    //     }

    //     var timetable = [];
    //     var start, end;
    //     for (var i in timegrid) {
    //         start = new Date(i * 1);
    //         end = gantt.date.add(start, 1, step);
    //         timetable.push({
    //             start_date: start,
    //             end_date: end,
    //             value: timegrid[i]
    //         });
    //     }

    //     return timetable;
    // }


    // var renderResourceLine = function (resource, timeline) {
    //     var tasks = gantt.getTaskBy("user", resource.id);
    //     var timetable = calculateResourceLoad(tasks, timeline.getScale());

    //     var row = document.createElement("div");

    //     for (var i = 0; i < timetable.length; i++) {

    //         var day = timetable[i];

    //         var css = "";
    //         if (day.value <= 8) {
    //             css = "gantt_resource_marker gantt_resource_marker_ok";
    //         } else {
    //             css = "gantt_resource_marker gantt_resource_marker_overtime";
    //         }

    //         var sizes = timeline.getItemPosition(resource, day.start_date, day.end_date);
    //         var el = document.createElement('div');
    //         el.className = css;

    //         el.style.cssText = [
    //             'left:' + sizes.left + 'px',
    //             'width:' + sizes.width + 'px',
    //             'position:absolute',
    //             'height:' + (gantt.config.row_height - 1) + 'px',
    //             'line-height:' + sizes.height + 'px',
    //             'top:' + sizes.top + 'px'
    //         ].join(";");

    //         el.innerHTML = day.value;
    //         row.appendChild(el);
    //     }
    //     return row;
    // };

    // var resourceLayers = [
    //     renderResourceLine,
    //     "taskBg"
    // ];

    // var mainGridConfig = {
    //     columns: [{
    //             name: "text",
    //             lavel: "Tarea",
    //             tree: true,
    //             width: 200,
    //             resize: true
    //         },
    //         {
    //             name: "start_date",
    //             label: "Inicio",
    //             align: "center",
    //             width: 80,
    //             resize: true
    //         },
    //         {
    //             name: "owner",
    //             align: "center",
    //             width: 60,
    //             label: "Owner",
    //             template: function (task) {
    //                 var store = gantt.getDatastore("resources");
    //                 var owner = store.getItem(task.user);
    //                 if (owner) {
    //                     return owner.label;
    //                 } else {
    //                     return "N/A";
    //                 }
    //             }
    //         },
    //         {
    //             name: "duration",
    //             label: "Duración",
    //             width: 50,
    //             align: "center"
    //         },
    //         {
    //             name: "add",
    //             label: "",
    //             width: 44
    //         }
    //     ]
    // };

    // var resourcePanelConfig = {
    //     columns: [{
    //             name: "name",
    //             label: "Name",
    //             template: function (resource) {
    //                 return resource.label;
    //             }
    //         },
    //         {
    //             name: "workload",
    //             label: "Workload",
    //             template: function (resource) {
    //                 var tasks = gantt.getTaskBy("user", resource.id);

    //                 var totalDuration = 0;
    //                 for (var i = 0; i < tasks.length; i++) {
    //                     totalDuration += tasks[i].duration;
    //                 }

    //                 return (totalDuration || 0) * 8 + "";
    //             }
    //         }
    //     ]
    // };

    // gantt.config.layout = {
    //     css: "gantt_container",
    //     rows: [{
    //             cols: [{
    //                     view: "grid",
    //                     group: "grids",
    //                     config: mainGridConfig,
    //                     scrollY: "scrollVer"
    //                 },
    //                 {
    //                     resizer: true,
    //                     width: 1,
    //                     group: "vertical"
    //                 },
    //                 {
    //                     view: "timeline",
    //                     id: "timeline",
    //                     scrollX: "scrollHor",
    //                     scrollY: "scrollVer"
    //                 },
    //                 {
    //                     view: "scrollbar",
    //                     id: "scrollVer",
    //                     group: "vertical"
    //                 }
    //             ]
    //         },
    //         {
    //             resizer: true,
    //             width: 1
    //         },
    //         {
    //             config: resourcePanelConfig,
    //             cols: [{
    //                     view: "grid",
    //                     id: "resourceGrid",
    //                     group: "grids",
    //                     bind: "resources",
    //                     scrollY: "resourceVScroll"
    //                 },
    //                 {
    //                     resizer: true,
    //                     width: 1,
    //                     group: "vertical"
    //                 },
    //                 {
    //                     view: "timeline",
    //                     id: "resourceTimeline",
    //                     bind: "resources",
    //                     bindLinks: null,
    //                     layers: resourceLayers,
    //                     scrollX: "scrollHor",
    //                     scrollY: "resourceVScroll"
    //                 },
    //                 {
    //                     view: "scrollbar",
    //                     id: "resourceVScroll",
    //                     group: "vertical"
    //                 }
    //             ]
    //         },
    //         {
    //             view: "scrollbar",
    //             id: "scrollHor"
    //         }
    //     ]
    // };

    // var resourcesStore = gantt.createDatastore({
    //     name: "resources",
    //     initItem: function (item) {
    //         item.id = item.key || gantt.uid();
    //         return item;
    //     }
    // });

    // var tasksStore = gantt.getDatastore("task");
    // tasksStore.attachEvent("onStoreUpdated", function (id, item, mode) {
    //     resourcesStore.refresh();
    // });

    // gantt.init(gantt_here);

    // axios.get('/diagrama-gantt/users')
    //     .then(function (response) {
    //         // handle success
    //         resourcesStore.parse(response.data);
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })

    // gantt.load("/diagrama-gantt/data");

    // var current_time = new Date();

    // var todayMarker = gantt.addMarker({
    //     start_date: current_time,
    //     css: "today",
    //     text: 'Now',
    // });
    // gantt.showDate(current_time);

    gantt.plugins({
        grouping: true,
        auto_scheduling: true
    });

    gantt.message({
        text: "You can assign work time in percentages from a daily workload.",
        expire: -1
    });

    var UNASSIGNED_ID = 5;
    var WORK_DAY = 8;

    function shouldHighlightTask(task) {
        var store = gantt.$resourcesStore;
        var taskResource = task[gantt.config.resource_property],
            selectedResource = store.getSelectedId();
        if (taskResource == selectedResource || store.isChildOf(taskResource, selectedResource)) {
            return true;
        }
    }

    gantt.templates.grid_row_class = function (start, end, task) {
        var css = [];
        if (gantt.hasChild(task.id)) {
            css.push("folder_row");
        }

        if (task.$virtual) {
            css.push("group_row")
        }

        if (shouldHighlightTask(task)) {
            css.push("highlighted_resource");
        }

        return css.join(" ");
    };

    gantt.templates.task_row_class = function (start, end, task) {
        if (shouldHighlightTask(task)) {
            return "highlighted_resource";
        }
        return "";
    };

    gantt.templates.timeline_cell_class = function (task, date) {
        if (!gantt.isWorkTime({
                date: date,
                task: task
            }))
            return "week_end";
        return "";
    };



    function getAllocatedValue(tasks, resource) {
        var result = 0;
        tasks.forEach(function (item) {
            var assignments = gantt.getResourceAssignments(resource.id, item.id);
            assignments.forEach(function (assignment) {
                result += WORK_DAY * assignment.value / 100;
            });
        });
        return result;
    }
    var cap = {};

    function getCapacity(date, resource) {
        /* it is sample function your could to define your own function for get Capability of resources in day */
        if (gantt.$resourcesStore.hasChild(resource.id)) {
            return -1;
        }

        var val = date.valueOf();
        if (!cap[val + resource.id]) {
            cap[val + resource.id] = [0, 1, 2, 3][Math.floor(Math.random() * 100) % 4];
        }
        return cap[val + resource.id] * WORK_DAY;
    }

    gantt.templates.histogram_cell_class = function (start_date, end_date, resource, tasks) {
        if (getAllocatedValue(tasks, resource) > getCapacity(start_date, resource)) {
            return "column_overload"
        }
    };

    gantt.templates.histogram_cell_label = function (start_date, end_date, resource, tasks) {
        if (tasks.length && !gantt.$resourcesStore.hasChild(resource.id)) {
            return getAllocatedValue(tasks, resource) + "/" + getCapacity(start_date, resource);
        } else {
            if (!gantt.$resourcesStore.hasChild(resource.id)) {
                return '&ndash;';
            }
            return '';
        }
    };
    gantt.templates.histogram_cell_allocated = function (start_date, end_date, resource, tasks) {
        return getAllocatedValue(tasks, resource);
    };

    gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks) {
        if (!gantt.isWorkTime(start_date)) {
            return 0;
        }
        return getCapacity(start_date, resource);
    };

    function shouldHighlightResource(resource) {
        var selectedTaskId = gantt.getState().selected_task;
        if (gantt.isTaskExists(selectedTaskId)) {
            var selectedTask = gantt.getTask(selectedTaskId),
                selectedResource = selectedTask[gantt.config.resource_property];

            if (resource.id == selectedResource) {
                return true;
            } else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
                return true;
            }
        }
        return false;
    }

    var resourceTemplates = {
        grid_row_class: function (start, end, resource) {
            var css = [];
            if (gantt.$resourcesStore.hasChild(resource.id)) {
                css.push("folder_row");
                css.push("group_row");
            }
            if (shouldHighlightResource(resource)) {
                css.push("highlighted_resource");
            }
            return css.join(" ");
        },
        task_row_class: function (start, end, resource) {
            var css = [];
            if (shouldHighlightResource(resource)) {
                css.push("highlighted_resource");
            }
            if (gantt.$resourcesStore.hasChild(resource.id)) {
                css.push("group_row");
            }

            return css.join(" ");
        }
    };

    gantt.locale.labels.section_owner = "Owner";
    gantt.config.lightbox.sections = [{
            name: "description",
            height: 38,
            map_to: "text",
            type: "textarea",
            focus: true
        },
        {
            name: "owner",
            type: "resources",
            map_to: "owner",
            options: gantt.serverList("people"),
            default_value: 100,
            unassigned_value: UNASSIGNED_ID
        },
        {
            name: "time",
            type: "duration",
            map_to: "auto"
        }
    ];
    gantt.config.resource_render_empty_cells = true;

    function getResourceAssignments(resourceId) {
        var assignments;
        var store = gantt.getDatastore(gantt.config.resource_store);
        if (store.hasChild(resourceId)) {
            assignments = [];
            store.getChildren(resourceId).forEach(function (childId) {
                assignments = assignments.concat(gantt.getResourceAssignments(childId));
            });
        } else {
            assignments = gantt.getResourceAssignments(resourceId);
        }
        return assignments;
    }

    var resourceConfig = {
        scale_height: 30,
        row_height: 45,
        scales: [{
            unit: "day",
            step: 1,
            date: "%d %M"
        }],
        columns: [{
                name: "name",
                label: "Name",
                tree: true,
                width: 200,
                template: function (resource) {
                    return resource.text;
                },
                resize: true
            },
            {
                name: "progress",
                label: "Complete",
                align: "center",
                template: function (resource) {
                    var totalToDo = 0,
                        totalDone = 0;

                    var assignments = getResourceAssignments(resource.id);

                    assignments.forEach(function (assignment) {
                        var task = gantt.getTask(assignment.task_id);
                        totalToDo += task.duration;
                        totalDone += task.duration * (task.progress || 0);
                    });

                    var completion = 0;
                    if (totalToDo) {
                        completion = (totalDone / totalToDo) * 100;
                    }

                    return Math.floor(completion) + "%";
                },
                resize: true
            },
            {
                name: "workload",
                label: "Workload",
                align: "center",
                template: function (resource) {
                    var totalDuration = 0;
                    var assignments = getResourceAssignments(resource.id);
                    assignments.forEach(function (assignment) {
                        var task = gantt.getTask(assignment.task_id);
                        totalDuration += (assignment.value / 100) * task.duration;
                    });
                    return (totalDuration || 0) * WORK_DAY + "h";
                },
                resize: true
            },

            {
                name: "capacity",
                label: "Capacity",
                align: "center",
                template: function (resource) {
                    var store = gantt.getDatastore(gantt.config.resource_store);
                    var n = store.hasChild(resource.id) ? store.getChildren(resource.id).length : 1;

                    var state = gantt.getState();

                    return gantt.calculateDuration(state.min_date, state.max_date) * n * WORK_DAY + "h";
                }
            }

        ]
    };

    gantt.config.scales = [{
            unit: "month",
            step: 1,
            format: "%F, %Y"
        },
        {
            unit: "day",
            step: 1,
            format: "%d %M"
        }
    ];

    gantt.config.auto_scheduling = true;
    gantt.config.auto_scheduling_strict = true;
    gantt.config.work_time = true;
    gantt.config.columns = [{
            name: "text",
            tree: true,
            width: 200,
            resize: true
        },
        {
            name: "start_date",
            align: "center",
            width: 80,
            resize: true
        },
        {
            name: "owner",
            align: "center",
            width: 80,
            label: "Owner",
            template: function (task) {
                if (task.type == gantt.config.types.project) {
                    return "";
                }

                var store = gantt.getDatastore("resource");
                var assignments = task[gantt.config.resource_property];

                if (!assignments || !assignments.length) {
                    return "Unassigned";
                }

                if (assignments.length == 1) {
                    return store.getItem(assignments[0].resource_id).text;
                }

                var result = "";
                assignments.forEach(function (assignment) {
                    var owner = store.getItem(assignment.resource_id);
                    if (!owner)
                        return;
                    result += "<div class='owner-label' title='" + owner.text + "'>" + owner.text.substr(0, 1) + "</div>";

                });

                return result;
            },
            resize: true
        },
        {
            name: "duration",
            width: 60,
            align: "center",
            resize: true
        },
        {
            name: "add",
            width: 44
        }
    ];

    gantt.config.resource_store = "resource";
    gantt.config.resource_property = "owner";
    gantt.config.order_branch = true;
    gantt.config.open_tree_initially = true;
    gantt.config.scale_height = 50;
    gantt.config.layout = {
        css: "gantt_container",
        rows: [{
                gravity: 2,
                cols: [{
                        view: "grid",
                        group: "grids",
                        scrollY: "scrollVer"
                    },
                    {
                        resizer: true,
                        width: 1
                    },
                    {
                        view: "timeline",
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
                width: 1,
                next: "resources"
            },
            {
                height: 35,
                cols: [{
                        html: "<label>Resource<select class='resource-select'></select>",
                        css: "resource-select-panel",
                        group: "grids"
                    },
                    {
                        resizer: true,
                        width: 1
                    },
                    {
                        html: ""
                    }
                ]
            },

            {
                gravity: 1,
                id: "resources",
                config: resourceConfig,
                templates: resourceTemplates,
                cols: [{
                        view: "resourceGrid",
                        group: "grids",
                        scrollY: "resourceVScroll"
                    },
                    {
                        resizer: true,
                        width: 1
                    },
                    {
                        view: "resourceHistogram",
                        capacity: 24,
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

    gantt.$resourcesStore = gantt.createDatastore({
        name: gantt.config.resource_store,
        type: "treeDatastore",
        initItem: function (item) {
            item.parent = item.parent || gantt.config.root_id;
            item[gantt.config.resource_property] = item.parent;
            item.open = true;
            return item;
        }
    });

    gantt.$resourcesStore.attachEvent("onAfterSelect", function (id) {
        gantt.refreshData();
    });

    gantt.init("gantt_here");

    gantt.attachEvent("onTaskLoading", function (task) {
        var ownerValue = task[gantt.config.resource_property];

        if (!task.$virtual && (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)) {
            task[gantt.config.resource_property] = [{
                resource_id: 5,
                value: 0
            }]; //'Unassigned' group
        }
        return true;
    });

    function toggleGroups(input) {
        console.log(input)
        gantt.$groupMode = !gantt.$groupMode;
        if (gantt.$groupMode) {
            input.value = "Mostrar Gantt";

            var groups = gantt.$resourcesStore.getItems().map(function (item) {
                var group = gantt.copy(item);
                group.group_id = group.id;
                group.id = gantt.uid();
                return group;
            });

            gantt.groupBy({
                groups: groups,
                relation_property: gantt.config.resource_property,
                group_id: "group_id",
                group_text: "text",
                delimiter: ", ",
                default_group_label: "Not Assigned"
            });
        } else {
            input.value = "Mostrar Recursos";
            gantt.groupBy(false);
        }
    }

    gantt.$resourcesStore.attachEvent("onParse", function () {
        var people = [];

        gantt.$resourcesStore.eachItem(function (res) {
            if (!gantt.$resourcesStore.hasChild(res.id)) {
                var copy = gantt.copy(res);
                copy.key = res.id;
                copy.label = res.text;
                copy.unit = "%";
                people.push(copy);
            }
        });
        gantt.updateCollection("people", people);
    });

    // axios.get('/diagrama-gantt/users')
    //     .then(function (response) {
    //         // handle success
    //         // gantt.$resourcesStore.parse(response.data);
    //         console.log(response.data)
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })

    gantt.$resourcesStore.parse([{
            id: 1,
            text: "QA",
            parent: null
        },
        {
            id: 2,
            text: "Development",
            parent: null
        },
        {
            id: 3,
            text: "Sales",
            parent: null
        },
        {
            id: 4,
            text: "Other",
            parent: null
        },
        {
            id: 5,
            text: "Unassigned",
            parent: 4,
            default: true
        },
        {
            id: 6,
            text: "John",
            parent: 1
        },
        {
            id: 7,
            text: "Mike",
            parent: 2
        },
        {
            id: 8,
            text: "Anna",
            parent: 2
        },
        {
            id: 9,
            text: "Bill",
            parent: 3
        },
        {
            id: 10,
            text: "Floe",
            parent: 3
        }
    ]);

    axios.get('/diagrama-gantt/data')
        .then(function (response) {
            // handle success
            gantt.parse(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}