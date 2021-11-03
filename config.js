var sensors_config = [
    {
        "sensors_number": 0,
        "sensors_name": "流量传感器",
        "sensors_value": [1, 2, 3, 4, 5]
    },
    {
        "sensors_number": 10,
        "sensors_name": "压力传感器",
        "sensors_value": [234,345,567]
    },
    {
        "sensors_number": 11,
        "sensors_name": "氧传感器",
        "sensors_value": [50,100]
    }
];



$(document).ready(function () {
    // 隐藏所有
    for (let i = 0; i < 20; i++) {
        $(".s" + i).css("display", "none");
    }
    for (let i = 0; i < sensors_config.length; i++) {
        $(".s" + sensors_config[i].sensors_number).css("display", "block");
        $(".s" + sensors_config[i].sensors_number+" h3").html(sensors_config[i].sensors_name);
    }
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
        $('#formModal').modal('show')
    });

})