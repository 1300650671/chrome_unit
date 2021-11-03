var port;
var reader;
var writer;
var keepReading = false;
var sensors_value = [
    {
        "name": 0,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 1,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 2,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 3,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 4,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 5,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 6,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 7,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 8,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 9,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 10,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 11,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 12,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 13,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 14,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 15,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 16,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 17,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 18,
        "flag": 0,
        "value": {
        }
    },
    {
        "name": 19,
        "flag": 0,
        "value": {
        }
    },
];
var sensors_select;

$(document).ready(function () {
    // 连接按钮

    $(".connect").click(() => {
        if (!keepReading) {
            connectSerial();
        } else {
            alert("请先断开串口链接！");
        }
    });

    // 断开连接
    $(".disconnect").click(async () => {
        keepReading = false;
        changeStatus();
        reader.cancel();
    });

    //保存并写入单个
    $(".btn_save_write").click(async () => {
        $('#formModal').modal('hide');
        for (let i = 0; i < 20; i++) {
            if ($("#input" + i + "0").val() != "") {
                let value1 = $("#input" + i + "0").val();
                let value2 = $("#input" + i + "1").val();
                sensors_value[sensors_select]["value"][value1] = value2;
            }
        }
        sensors_value[sensors_select]["flag"] = 1;
        $("input").val("");
        sendOneData(sensors_select);
    });

    //保存单个
    $(".btn_save").click(async () => {
        $('#formModal').modal('hide');
        for (let i = 0; i < 20; i++) {
            if ($("#input" + i + "0").val() != "") {
                let value1 = $("#input" + i + "0").val();
                let value2 = $("#input" + i + "1").val();
                sensors_value[sensors_select]["value"][value1] = value2;
            }
        }
        sensors_value[sensors_select]["flag"] = 1;
        $("input").val("");
    });

    //取消
    $(".btn_back").click(async () => {
        $("#formModal").modal('hide');
        $("input").val("");
    });

    // 写入全部
    $(".write_sensor_value_all").click(async () => {
        for (let i = 0; i < 20; i++) {
            sendOneData(sensors_select);
        }
    });

    //删除全部
    $(".del_sensor_value_all").click(async () => {
        let res_string = "unit_factor 34";
        res_string = res_string + "\r\n";
        let res_u8 = stringToUint8Array(res_string);
        await writer.write(res_u8);
    });

    //刷新写入状态
    $(".refresh_all").click(async () => {
        let res_string = "unit_factor 51";
        res_string = res_string + "\r\n";
        let res_u8 = stringToUint8Array(res_string);
        await writer.write(res_u8);
    });

    //选择传感器
    $(".col-md-2").click(function () {
        //获取传感器的序号
        var index = $(".col-md-2").index(this);
        sensors_select = index;
        let i = 0;
        if (sensors_value[sensors_select]["flag"] != 0) {
            for (var k in sensors_value[sensors_select]["value"]) {  //遍历packJson 对象的每个key/value对,k为key
                // alert(k + " " + sensors_value[sensors_select]["value"][k]);
                $("#input" + i + "0").val(k);
                $("#input" + i + "1").val(sensors_value[sensors_select]["value"][k]);
                i++;
            }
        }
        let j
        for (j = 0; j < sensors_config.length; j++) {
            if (sensors_config[j].sensors_number == sensors_select)
                break;
        }
        for (let i = 0; i < 20; i++) {
            if(i<sensors_config[j].sensors_value.length){
                $('.d'+i).html(sensors_config[j].sensors_value[i]);
            }
            else{
                $('.d'+i).parents(".form-group").css("display", "none");
            }
           
        }

        $('#formModal').modal('show')
    });


});

//连接按钮
async function connectSerial() {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 }); // set baud rate
    keepReading = true;
    changeStatus();
    reader = port.readable.getReader();
    writer = port.writable.getWriter();
    var res = "";

    while (port.readable && keepReading) {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    // Allow the serial port to be closed later.
                    writer.releaseLock();
                    break;
                }
                if (value) {
                    /*** TODO: deal with the data value ***/
                    // console.log(value);
                    // console.log(value[0]);
                    // console.log(value[1]);
                    // dealData(value);
                    for (var i = 0; i < value.length; i++) {
                        res += String.fromCharCode(value[i]);
                    }

                    if (res.indexOf("FFFF") > -1) {
                        var str = res.split("FFFF")[0];
                        //    str = str.replaceAll("'","\"");
                        var json = JSON.parse(str);
                        //    console.log(json);
                        changeSensorsStatus(json);
                        res = "";
                    }
                }
            }
        } catch (error) {
            // Handle non-fatal read error.
            // console.error(error);
            res = "";
        } finally {
            console.log(port.readable, keepReading);
        }
    }
    await port.close();
    console.log("port closed");
}

//改变链接图标颜色
function changeStatus() {
    if (keepReading) {
        $(".connect").html('<svg t="1635399235432" width="25px" height="25px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3926" width="32" height="32"><path d="M923.875556 732.728889c-2.275556-54.613333-25.031111-104.675556-65.991112-145.635556l-65.991111-65.991111c-20.48-20.48-54.613333-20.48-75.093333 0-20.48 20.48-20.48 54.613333 0 75.093334l65.991111 65.991111c20.48 20.48 34.133333 47.786667 34.133333 75.093333 0 18.204444-2.275556 45.511111-25.031111 68.266667-20.48 20.48-45.511111 25.031111-63.715555 25.031111-27.306667 0-56.888889-13.653333-79.644445-34.133334l-166.115555-166.115555c-40.96-40.96-45.511111-104.675556-9.102222-141.084445 20.48-20.48 20.48-54.613333 0-75.093333-20.48-20.48-54.613333-20.48-75.093334 0-38.684444 38.684444-56.888889 86.471111-56.888889 138.808889 0 54.613333 22.755556 111.502222 65.991111 154.737778l166.115556 166.115555c40.96 40.96 97.848889 65.991111 154.737778 65.991111 52.337778 0 102.4-20.48 138.808889-56.888888 40.96-40.96 61.44-95.573333 56.888889-150.186667z m0 0" fill="#1afa29" p-id="3927"></path><path d="M309.475556 452.835556c-2.275556 0-2.275556 0 0 0l-45.511112-45.511112-22.755555-22.755555c-20.48-20.48-34.133333-45.511111-36.408889-72.817778 0-18.204444 2.275556-45.511111 25.031111-68.266667 20.48-20.48 45.511111-25.031111 63.715556-25.031111 27.306667 0 56.888889 11.377778 79.644444 34.133334l166.115556 166.115555c40.96 40.96 45.511111 104.675556 9.102222 141.084445-20.48 20.48-20.48 54.613333 0 75.093333 20.48 20.48 54.613333 20.48 75.093333 0 38.684444-38.684444 56.888889-86.471111 56.888889-138.808889 0-54.613333-22.755556-111.502222-65.991111-154.737778l-166.115556-166.115555c-40.96-40.96-97.848889-65.991111-154.737777-65.991111-52.337778 0-102.4 20.48-138.808889 56.888889-38.684444 38.684444-59.164444 93.297778-56.888889 147.911111 2.275556 54.613333 25.031111 104.675556 65.991111 145.635555l22.755556 22.755556 43.235555 45.511111c20.48 20.48 54.613333 20.48 75.093333 0 22.755556-20.48 25.031111-54.613333 4.551112-75.093333z m0 0" fill="#1afa29" p-id="3928"></path></svg>');
    } else {

        $(".connect").html('<svg t="1635399235432" width="25px" height="25px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3926" width="32" height="32"><path d="M923.875556 732.728889c-2.275556-54.613333-25.031111-104.675556-65.991112-145.635556l-65.991111-65.991111c-20.48-20.48-54.613333-20.48-75.093333 0-20.48 20.48-20.48 54.613333 0 75.093334l65.991111 65.991111c20.48 20.48 34.133333 47.786667 34.133333 75.093333 0 18.204444-2.275556 45.511111-25.031111 68.266667-20.48 20.48-45.511111 25.031111-63.715555 25.031111-27.306667 0-56.888889-13.653333-79.644445-34.133334l-166.115555-166.115555c-40.96-40.96-45.511111-104.675556-9.102222-141.084445 20.48-20.48 20.48-54.613333 0-75.093333-20.48-20.48-54.613333-20.48-75.093334 0-38.684444 38.684444-56.888889 86.471111-56.888889 138.808889 0 54.613333 22.755556 111.502222 65.991111 154.737778l166.115556 166.115555c40.96 40.96 97.848889 65.991111 154.737778 65.991111 52.337778 0 102.4-20.48 138.808889-56.888888 40.96-40.96 61.44-95.573333 56.888889-150.186667z m0 0" fill="#d81e06" p-id="3927"></path><path d="M309.475556 452.835556c-2.275556 0-2.275556 0 0 0l-45.511112-45.511112-22.755555-22.755555c-20.48-20.48-34.133333-45.511111-36.408889-72.817778 0-18.204444 2.275556-45.511111 25.031111-68.266667 20.48-20.48 45.511111-25.031111 63.715556-25.031111 27.306667 0 56.888889 11.377778 79.644444 34.133334l166.115556 166.115555c40.96 40.96 45.511111 104.675556 9.102222 141.084445-20.48 20.48-20.48 54.613333 0 75.093333 20.48 20.48 54.613333 20.48 75.093333 0 38.684444-38.684444 56.888889-86.471111 56.888889-138.808889 0-54.613333-22.755556-111.502222-65.991111-154.737778l-166.115556-166.115555c-40.96-40.96-97.848889-65.991111-154.737777-65.991111-52.337778 0-102.4 20.48-138.808889 56.888889-38.684444 38.684444-59.164444 93.297778-56.888889 147.911111 2.275556 54.613333 25.031111 104.675556 65.991111 145.635555l22.755556 22.755556 43.235555 45.511111c20.48 20.48 54.613333 20.48 75.093333 0 22.755556-20.48 25.031111-54.613333 4.551112-75.093333z m0 0" fill="#d81e06" p-id="3928"></path></svg>');
    }
}

//改变传感器颜色
function changeSensorsStatus(json) {
    for (var key in json) {
        $("." + key).removeClass("panel-solid-danger");
        $("." + key).removeClass("panel-solid-success");
        $("." + key).addClass(json[key] == 0 ? 'panel-solid-danger' : 'panel-solid-success');
    }
}

//发送单条数据
async function sendOneData(sensor) {
    if (sensors_value[sensor]["flag"] = 0)
        return;
    let res_string = "unit_factor 0 ";
    res_string = res_string + sensor;

    for (var k in sensors_value[sensor]["value"]) {  //遍历packJson 对象的每个key/value对,k为key
        res_string = res_string + " " + k + " " + sensors_value[sensor]["value"][k];
    }

    // console.log(res_string);
    res_string = res_string + "\r\n";
    let res_u8 = stringToUint8Array(res_string);
    // console.log(res_u8);
    await writer.write(res_u8);
}

//字符串转数组
function stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array
}