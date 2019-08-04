const pgcon = require('./newnode_pgconnection')
const config = require('./config')
const jwt = require('jsonwebtoken')
const moment = require('moment')

exports.get_operator = async (req, res) => {
    let sql = `SELECT m.* , o.operating_unit_name , o.tel  FROM operator_master m LEFT JOIN operating_unit o ON o.operating_unit_id = m.operating_unit_id ORDER BY operator_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_operating = async (req, res) => {
    let sql = `SELECT * FROM operating_unit ORDER BY operating_unit_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_pharmacy = async (req, res) => {
    let sql = `SELECT * FROM pharmacy ORDER BY pharmacy_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_professional = async (req, res) => {
    let sql = `SELECT * FROM professional ORDER BY professional_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_vehicle = async (req, res) => {
    let sql = `SELECT v.* , o.operating_unit_name , o.tel FROM vehicle_master v LEFT JOIN operating_unit o ON o.operating_unit_id = v.operating_unit_id ORDER BY vehicle_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_command_vehicle = async (req, res) => {
    let emergency_reported_id = req.query['emergency_reported_id']
    let sql1 = `SELECT * FROM waiting_master WHERE emergency_reported_id = ${emergency_reported_id}`
    var r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        let value = []
        let where = ""
        console.log(r1);

        if (r1.data.length > 0) {
            value = r1.data.map(x => `'${x.operating_unit_id}'`).join()
            where = " WHERE v.operating_unit_id NOT IN (" + value + ")"
        }
        let sql2 = `SELECT v.* , o.operating_unit_name , o.tel FROM vehicle_master v LEFT JOIN operating_unit o ON o.operating_unit_id = v.operating_unit_id ` + where + ` ORDER BY vehicle_id`
        let r2 = await pgcon.get(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: false, message: r2.message })
        } else {
            res.send({ code: false, data: r2.data })
        }
    }
}

exports.get_volunteer = async (req, res) => {
    let sql = `SELECT v.* , o.operating_unit_name FROM volunteer_master v LEFT JOIN operating_unit o ON o.operating_unit_id = v.operating_unit_id  ORDER BY volunteer_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_position = async (req, res) => {
    let sql = `SELECT * FROM position_master`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.add_operator = async (req, res) => {
    let position = req.body['position']
    let department = req.body['department']
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let birth_date = req.body['birth_date']
    let race = req.body['race']
    let religion = req.body['religion']
    let blood_type = req.body['blood_type']
    let career = req.body['career']
    let now_address = req.body['now_address']
    let now_tambon = req.body['now_tambon']
    let now_amphur = req.body['now_amphur']
    let now_province = req.body['now_province']
    let now_postcode = req.body['now_postcode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let contact_no = req.body['contact_no']
    let education_bg = req.body['education_bg']
    let graduation_year = req.body['graduation_year']
    let ems_lv = req.body['ems_lv']
    let ems_name = req.body['ems_name']
    let ems_year = req.body['ems_year']
    let university = req.body['university']
    let training_skill = req.body['training_skill']
    let expert_skill = req.body['expert_skill']
    let register_year = req.body['register_year']
    let register_result = req.body['register_result']
    let img = req.body['img']
    let remark = req.body['remark']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'operator_master'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "O-" + ("000000" + last_count).slice(-5);
    let sql2 = `SELECT operator_id FROM operator_master WHERE  (name = '${name}' AND surname = '${surname}') OR card_id = '${card_id}'`
    let check_duplicate_id = await pgcon.get(null, sql2, config.connectionString())
    if (check_duplicate_id.data.length > 0) {
        res.send({ code: "-1", message: "Duplicated name or card_id" })
    } else {
        let sql3 = `INSERT INTO operator_master(operator_id,position,operating_unit_id,name,surname,card_id,birth_date,race,religion,blood_type,career,now_address,now_tambon,` +
            `now_amphur,now_province,now_postcode,card_address,card_tambon,card_amphur,card_province,card_postcode,contact_no,education_bg,graduation_year,` +
            `ems_lv,ems_name,ems_year,name_prefix,university,training_skill,expert_skill,register_year,register_result,img,remark,perform_count) VALUES ` +
            `('${last_id}','${position}','${department}','${name}','${surname}','${card_id}','${moment(birth_date).format("YYYY-MM-DD")}','${race}',` +
            `'${religion}','${blood_type}','${career}','${now_address}','${now_tambon}','${now_amphur}','${now_province}','${now_postcode}','${card_address}',` +
            `'${card_tambon}','${card_amphur}','${card_province}','${card_postcode}','${contact_no}','${education_bg}','${graduation_year}','${ems_lv}',` +
            `'${ems_name}','${ems_year}','${name_prefix}','${university}','${training_skill}','${expert_skill}','${register_year}','${register_result}','${img}','${remark}',0);
            UPDATE increment_id SET count = count + 1 WHERE type = 'operator_master';`
        let r3 = await pgcon.execute(null, sql3, config.connectionString())
        if (r3.code) {
            res.send({ code: -1, message: "Insert operator error" })
        } else {
            res.send({ code: false })
        }
    }

}

exports.add_pharmacy = async (req, res) => {
    let name = req.body['name']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let contact_name = req.body['contact_name']
    let contact_tel = req.body['contact_tel']
    let medicine = req.body['medicine']
    let medical_supply = req.body['medical_supply']
    let medical_equipment = req.body['medical_equipment']
    let disaster_equipment = req.body['disaster_equipment']
    let remark = req.body['remark']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'pharmacy'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "PH-" + ("000000" + last_count).slice(-5);
    let sql3 = `INSERT INTO pharmacy(pharmacy_id,name,address,tambon,amphur,province,postcode,contact_name,contact_tel,medicine,medical_supply,` +
        `medical_equipment,disaster_equipment,remark,lat,lon) VALUES ('${last_id}','${name}','${address}','${tambon}','${amphur}',` +
        `'${province}','${postcode}','${contact_name}','${contact_tel}','${medicine}','${medical_supply}','${medical_equipment}'` +
        `,'${disaster_equipment}','${remark}',${lat},${lon});
            UPDATE increment_id SET count = count + 1 WHERE type = 'pharmacy';`
    let r3 = await pgcon.execute(null, sql3, config.connectionString())
    if (r3.code) {
        res.send({ code: -1, message: "Insert pharmacy error" })
    } else {
        res.send({ code: false })
    }
}

exports.add_operating_unit = async (req, res) => {
    let operating_unit_name = req.body['operating_unit_name']
    let department = req.body['department']
    let zone = req.body['zone']
    let unit_type = req.body['unit_type']
    let unit_size = req.body['unit_size']
    let unit_status = req.body['unit_status']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let tel = req.body['tel']
    let employee_number = req.body['employee_number'] == '' ? "NULL" : req.body['employee_number']
    let ambulance_number = req.body['ambulance_number'] == '' ? "NULL" : req.body['ambulance_number']
    let manager_name = req.body['manager_name']
    let remark = req.body['remark']
    let lat = req.body['lat']
    let lon = req.body['lon']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'operating_unit'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "U-" + ("000000" + last_count).slice(-5);
    let sql2 = `SELECT operating_unit_id FROM operating_unit WHERE operating_unit_name = '${operating_unit_name}'`
    let check_duplicate_id = await pgcon.get(null, sql2, config.connectionString())
    if (check_duplicate_id.data.length > 0) {
        res.send({ code: "-1", message: "Duplicated name or card_id" })
    } else {
        let sql3 = `INSERT INTO operating_unit(operating_unit_id,operating_unit_name,department,zone,unit_type,unit_size,unit_status,address,tambon,amphur` +
            `,province,postcode,tel,employee_number,ambulance_number,manager_name,remark,lat,lon,perform_count,decline_count) VALUES ('${last_id}','${operating_unit_name}','${department}','${zone}','${unit_type}',` +
            `'${unit_size}','${unit_status}','${address}','${tambon}','${amphur}','${province}','${postcode}'` +
            `,'${tel}',${employee_number},${ambulance_number},'${manager_name}','${remark}','${lat}','${lon}',0,0);
            UPDATE increment_id SET count = count + 1 WHERE type = 'operating_unit';`
        let r3 = await pgcon.execute(null, sql3, config.connectionString())
        if (r3.code) {
            res.send({ code: -1, message: "Insert operating_unit error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.add_volunteer = async (req, res) => {
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let now_address = req.body['now_address']
    let now_tambon = req.body['now_tambon']
    let now_amphur = req.body['now_amphur']
    let now_province = req.body['now_province']
    let now_postscode = req.body['now_postscode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let operating_unit_id = req.body['operating_unit_id']
    let contact_number = req.body['contact_number']
    let training = req.body['training']
    let skill = req.body['skill']
    let note = req.body['note']
    let img = req.body['img']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'volunteer'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "VO-" + ("000000" + last_count).slice(-5);
    // let sql2 = `SELECT volunteer_id FROM volunteer_master WHERE operating_unit_name = '${operating_unit_name}'`
    // let check_duplicate_id = await pgcon.get(null, sql2, config.connectionString())
    // if (check_duplicate_id.data.length > 0) {
    //     res.send({ code: "-1", message: "Duplicated name or card_id" })
    // } else {
    let sql3 = `INSERT INTO volunteer_master(volunteer_id,name_prefix,name,surname,card_id,now_address,now_tambon,now_amphur,now_province,now_postcode,card_address,` +
        `card_tambon,card_amphur,card_province,card_postcode,operating_unit_id,contact_number,training,skill,note,img,lat,lon) VALUES ('${last_id}','${name_prefix}','${name}'` +
        `,'${surname}','${card_id}','${now_address}','${now_tambon}','${now_amphur}','${now_province}','${now_postscode}','${card_address}','${card_tambon}','${card_amphur}'` +
        `,'${card_province}','${card_postcode}','${operating_unit_id}','${contact_number}','${training}','${skill}','${note}','${img}',${lat},${lon});
            UPDATE increment_id SET count = count + 1 WHERE type = 'volunteer';`
    let r3 = await pgcon.execute(null, sql3, config.connectionString())
    if (r3.code) {
        res.send({ code: -1, message: "Insert volunteer error" })
    } else {
        res.send({ code: false })
    }
    // }
}

exports.add_professional = async (req, res) => {
    let professional_prefix = req.body['professional_prefix']
    let professional_name = req.body['professional_name']
    let professional_surname = req.body['professional_surname']
    let operating_unit_id = req.body['operating_unit_id']
    let special_expert = req.body['special_expert']
    let career = req.body['career']
    let card_id = req.body['card_id']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let tel = req.body['tel']
    let photo = req.body['photo']
    let lat = req.body['lat']
    let lon = req.body['lat']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'professional'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "PR-" + ("000000" + last_count).slice(-5);
    let sql3 = `INSERT INTO professional(professional_id,professional_prefix,professional_name,professional_surname,operating_unit_id,special_expert,career,card_id` +
        `,address,tambon,amphur,province,postcode,card_address,card_tambon,card_amphur,card_province,card_postcode,tel,photo,lat,lon) VALUES ('${last_id}','${professional_prefix}'` +
        `,'${professional_name}','${professional_surname}','${operating_unit_id}','${special_expert}','${career}','${card_id}','${address}','${tambon}','${amphur}','${province}'` +
        `,'${postcode}','${card_address}','${card_tambon}','${card_amphur}','${card_province}','${card_postcode}','${tel}','${photo}','${lat}','${lon}');
            UPDATE increment_id SET count = count + 1 WHERE type = 'professional';`
    let r3 = await pgcon.execute(null, sql3, config.connectionString())
    if (r3.code) {
        res.send({ code: -1, message: "Insert professional error" })
    } else {
        res.send({ code: false })
    }
}

exports.add_vehicle = async (req, res) => {
    let std_vehicle_id = req.body['std_vehicle_id']
    let vehicle_book_id = req.body['vehicle_book_id']
    let possessor_type = req.body['possessor_type']
    let possessor_organize_name = req.body['possessor_organize_name']
    let possessor_prefix = req.body['possessor_prefix']
    let possessor_name = req.body['possessor_name']
    let possessor_surname = req.body['possessor_surname']
    let vehicle_check_year = req.body['vehicle_check_year']
    let driver1 = req.body['driver1']
    let driver2 = req.body['driver2']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let operating_unit_id = req.body['operating_unit_id']
    let department_type = req.body['department_type']
    let vehicle_type = req.body['vehicle_type']
    let vehicle_using_type = req.body['vehicle_using_type']
    let work_zone = req.body['work_zone']
    let parking_point = req.body['parking_point']
    let license_issue_date = req.body['license_issue_date'] = req.body['license_issue_date'] == '' ? "NULL" : `'${req.body['license_issue_date']}'`
    let license_expire_date = req.body['license_expire_date'] = req.body['license_expire_date'] == '' ? "NULL" : `'${req.body['license_expire_date']}'`
    let result = req.body['result']
    let plate_register_date = req.body['plate_register_date'] = req.body['plate_register_date'] = req.body['plate_register_date'] == '' ? "NULL" : `'${req.body['plate_register_date']}'`
    let plate_number = req.body['plate_number']
    let plate_province = req.body['plate_province']
    let car_type = req.body['car_type']
    let vehicle_style = req.body['vehicle_style']
    let brand_name = req.body['brand_name']
    let car_model = req.body['car_model']
    let car_generation_year = req.body['car_generation_year']
    let car_color = req.body['car_color']
    let chassis_no = req.body['chassis_no']
    let chassis_position = req.body['chassis_position']
    let engine_brand = req.body['engine_brand']
    let engine_no = req.body['engine_no']
    let engine_no_position = req.body['engine_no_position']
    let fuel = req.body['fuel']
    let gas_no = req.body['gas_no']
    let piston_count = req.body['piston_count'] = req.body['piston_count'] == '' ? "NULL" : req.body['piston_count']
    let piston_displacement = req.body['piston_displacement'] = req.body['piston_displacement'] == '' ? "NULL" : req.body['piston_displacement']
    let horse_power = req.body['horse_power'] = req.body['horse_power'] == '' ? "NULL" : req.body['horse_power']
    let axle_count = req.body['axle_count'] = req.body['axle_count'] == '' ? "NULL" : req.body['axle_count']
    let tire_count = req.body['tire_count'] = req.body['tire_count'] == '' ? "NULL" : req.body['tire_count']
    let car_weight = req.body['car_weight'] = req.body['car_weight'] == '' ? "NULL" : req.body['car_weight']
    let container_weight = req.body['container_weight'] = req.body['container_weight'] == '' ? "NULL" : req.body['container_weight']
    let total_weight = req.body['total_weight'] = req.body['total_weight'] == '' ? "NULL" : req.body['total_weight']
    let font_img = req.body['font_img']
    let back_img = req.body['back_img']
    let left_img = req.body['left_img']
    let right_img = req.body['right_img']
    let inner_img = req.body['inner_img']
    let possesion_date = req.body['possesion_date'] = req.body['possesion_date'] == '' ? "NULL" : `'${req.body['possesion_date']}'`
    let owner_name = req.body['owner_name']
    let owner_card_id = req.body['owner_card_id']
    let owner_bod = req.body['owner_bod'] = req.body['owner_bod'] == '' ? "NULL" : `'${req.body['owner_bod']}'`
    let owner_nationality = req.body['owner_nationality']
    let owner_address = req.body['owner_address']
    let owner_tel = req.body['owner_tel']
    let rental_agreement_no = req.body['rental_agreement_no']
    let rent_date = req.body['rent_date'] = req.body['rent_date'] == '' ? "NULL" : `'${req.body['rent_date']}'`
    let draff_date = req.body['draff_date'] = req.body['draff_date'] == '' ? "NULL" : `'${req.body['draff_date']}'`
    let edit_date = req.body['edit_date'] = req.body['edit_date'] == '' ? "NULL" : `'${req.body['edit_date']}'`
    let data_status = req.body['data_status']
    let outside_data_reference = req.body['outside_data_reference']
    let source_data = req.body['source_data']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'vehicle'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let last_id = "VE-" + ("000000" + last_count).slice(-5);
    let sql2 = `SELECT std_vehicle_id FROM vehicle_master WHERE std_vehicle_id = '${std_vehicle_id}'`
    let check_duplicate_id = await pgcon.get(null, sql2, config.connectionString())
    if (check_duplicate_id.data.length > 0) {
        res.send({ code: "-1", message: "Duplicated std_vehicle_id" })
    } else {
        let sql3 = `INSERT INTO vehicle_master(vehicle_id,std_vehicle_id,vehicle_book_id,possessor_type,possessor_organize_name,possessor_prefix,possessor_name,possessor_surname` +
            `,vehicle_check_year,driver1,driver2,address,tambon,amphur,province,operating_unit_id,department_type,vehicle_type,vehicle_using_type,work_zone,parking_point` +
            `,license_issue_date,license_expire_date,result,plate_register_date,plate_number,plate_province,car_type,vehicle_style,brand_name,car_model,car_generation_year` +
            `,car_color,chassis_no,chassis_position,engine_brand,engine_no,engine_no_position,fuel,gas_no,piston_count,piston_displacement,horse_power,axle_count` +
            `,tire_count,car_weight,container_weight,total_weight,font_img,back_img,left_img,right_img,inner_img,possesion_date,owner_name,owner_card_id,owner_bod` +
            `,owner_nationality,owner_address,owner_tel,rental_agreement_no,rent_date,draff_date,edit_date,data_status,outside_data_reference,source_data)` +
            ` VALUES ('${last_id}','${std_vehicle_id}','${vehicle_book_id}','${possessor_type}','${possessor_organize_name}','${possessor_prefix}'` +
            `,'${possessor_name}','${possessor_surname}','${vehicle_check_year}','${driver1}'` +
            `,'${driver2}','${address}','${tambon}','${amphur}','${province}','${operating_unit_id}','${department_type}','${vehicle_type}','${vehicle_using_type}','${work_zone}'` +
            `,'${parking_point}',${license_issue_date},${license_expire_date},'${result}',${plate_register_date},'${plate_number}','${plate_province}','${car_type}','${vehicle_style}','${brand_name}'` +
            `,'${car_model}','${car_generation_year}','${car_color}','${chassis_no}','${chassis_position}','${engine_brand}','${engine_no}','${engine_no_position}','${fuel}','${gas_no}'` +
            `,${piston_count},${piston_displacement},${horse_power},${axle_count},${tire_count},${car_weight},${container_weight},${total_weight},'${font_img}','${back_img}'` +
            `,'${left_img}','${right_img}','${inner_img}',${possesion_date},'${owner_name}','${owner_card_id}',${owner_bod},'${owner_nationality}','${owner_address}','${owner_tel}'` +
            `,'${rental_agreement_no}',${rent_date},${draff_date},${edit_date},'${data_status}','${outside_data_reference}','${source_data}');
            UPDATE increment_id SET count = count + 1 WHERE type = 'vehicle';`
        console.log(data_status);

        let r3 = await pgcon.execute(null, sql3, config.connectionString())
        if (r3.code) {
            res.send({ code: -1, message: "Insert vehicle_master error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_operator = async (req, res) => {
    let operator_id = req.query['operator_id']
    let sql = "SELECT operator_id FROM  operator_master WHERE operator_id = '" + operator_id + "'"
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Operator ID not found" })
    } else {
        let sql2 = `DELETE FROM operator_master WHERE operator_id = '${operator_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete operator_master error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_operating_unit = async (req, res) => {
    let operating_unit_id = req.query['operating_unit_id']
    let sql = "SELECT operating_unit_id FROM  operating_unit WHERE operating_unit_id = '" + operating_unit_id + "'"
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Operating ID not found" })
    } else {
        let sql2 = `DELETE FROM operating_unit WHERE operating_unit_id = '${operating_unit_id}';
        UPDATE operator_master SET operating_unit_id = NULL WHERE operating_unit_id = '${operating_unit_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete operating_unit error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_vehicle = async (req, res) => {
    let vehicle_id = req.query['vehicle_id']
    let sql = `SELECT vehicle_id FROM vehicle_master WHERE vehicle_id = '${vehicle_id}'`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Operating ID not found" })
    } else {
        let sql2 = `DELETE FROM vehicle_master WHERE vehicle_id = '${vehicle_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete vehicle_master error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_professional = async (req, res) => {
    let professional_id = req.query['professional_id']
    let sql = `SELECT professional_id FROM professional WHERE professional_id = '${professional_id}'`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Professional ID not found" })
    } else {
        let sql2 = `DELETE FROM professional WHERE professional_id = '${professional_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete professional error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_pharmacy = async (req, res) => {
    let pharmacy_id = req.query['pharmacy_id']
    let sql = `SELECT pharmacy_id FROM pharmacy WHERE pharmacy_id = '${pharmacy_id}'`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Pharmacy ID not found" })
    } else {
        let sql2 = `DELETE FROM pharmacy WHERE pharmacy_id = '${pharmacy_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete pharmacy error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_volunteer = async (req, res) => {
    let volunteer_id = req.query['volunteer_id']
    let sql = `SELECT volunteer_id FROM volunteer_master WHERE volunteer_id = '${volunteer_id}'`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Volunteer ID not found" })
    } else {
        let sql2 = `DELETE FROM volunteer_master WHERE volunteer_id = '${volunteer_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete Volunteer error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.delete_hospital = async (req, res) => {
    let hospital_id = req.query['hospital_id']
    let sql = `SELECT hospital_id FROM hospital_master WHERE hospital_id = '${hospital_id}'`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "hospital ID not found" })
    } else {
        let sql2 = `DELETE FROM hospital_master WHERE hospital_id = '${hospital_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            res.send({ code: -1, message: "Delete hospital error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.update_operator = async (req, res) => {
    let operator_id = req.body['operator_id']
    let position = req.body['position']
    let department = req.body['department']//operating_unit_id
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let birth_date = req.body['birth_date']
    let race = req.body['race']
    let religion = req.body['religion']
    let blood_type = req.body['blood_type']
    let career = req.body['career']
    let now_address = req.body['now_address']
    let now_tambon = req.body['now_tambon']
    let now_amphur = req.body['now_amphur']
    let now_province = req.body['now_province']
    let now_postcode = req.body['now_postcode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let contact_no = req.body['contact_no']
    let education_bg = req.body['education_bg']
    let graduation_year = req.body['graduation_year']
    let ems_lv = req.body['ems_lv']
    let ems_name = req.body['ems_name']
    let ems_year = req.body['ems_year']
    let university = req.body['university']
    let training_skill = req.body['training_skill']
    let expert_skill = req.body['expert_skill']
    let register_year = req.body['register_year']
    let register_result = req.body['register_result']
    let img = req.body['img']
    let remark = req.body['remark']
    let sql1 = `SELECT * FROM operator_master WHERE operator_id = '${operator_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Operator ID not found" })
    } else {
        let sql2 = `UPDATE operator_master SET position = '${position}' , operating_unit_id = '${department}' , name = '${name}' , surname = '${surname}' ` +
            `,card_id = '${card_id}' ,birth_date = '${birth_date}' ,race = '${race}' ,religion = '${religion}', blood_type = '${blood_type}'` +
            `,career = '${career}' ,now_address = '${now_address}' ,now_tambon='${now_tambon}' ,now_amphur = '${now_amphur}' ,now_province = '${now_province}'` +
            `,now_postcode = '${now_postcode}' ,card_address = '${card_address}' ,card_tambon = '${card_tambon}' ,card_amphur = '${card_amphur}'` +
            `,card_province = '${card_province}' ,card_postcode = '${card_postcode}' ,contact_no = '${contact_no}' ,education_bg = '${education_bg}'` +
            `,graduation_year = '${graduation_year}' ,ems_lv = '${ems_lv}' ,ems_name = '${ems_name}' ,ems_year = '${ems_year}' , name_prefix = '${name_prefix}' ` +
            `,university = '${university}' ,training_skill = '${training_skill}' ,expert_skill = '${expert_skill}' ,register_year = '${register_year}'` +
            `,register_result = '${register_result}' ,img = '${img}' ,remark = '${remark}'` +
            `WHERE operator_id = '${operator_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            console.log(r2);
            res.send({ code: true, message: "Operator update error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.update_operating_unit = async (req, res) => {
    let operating_unit_id = req.body['operating_unit_id']
    let operating_unit_name = req.body['operating_unit_name']
    let department = req.body['department']
    let zone = req.body['zone']
    let unit_type = req.body['unit_type']
    let unit_size = req.body['unit_size']
    let unit_status = req.body['unit_status']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let tel = req.body['tel']
    let employee_number = req.body['employee_number'] == '' ? "NULL" : req.body['employee_number']
    let ambulance_number = req.body['ambulance_number'] == '' ? "NULL" : req.body['ambulance_number']
    let manager_name = req.body['manager_name']
    let remark = req.body['remark']
    let lat = req.body['lat'] = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT * FROM operating_unit WHERE operating_unit_id = '${operating_unit_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: "Operator ID not found" })
    } else {
        let sql2 = `UPDATE operating_unit SET operating_unit_name = '${operating_unit_name}' ,department = '${department}' ,zone = '${zone}' ,unit_type = '${unit_type}'` +
            `,unit_size = '${unit_size}' ,unit_status = '${unit_status}' ,address = '${address}' ,tambon = '${tambon}' ,amphur = '${amphur}' ,province = '${province}'` +
            `,postcode = '${postcode}' ,tel = '${tel}' ,employee_number = ${employee_number} ,ambulance_number = ${ambulance_number} ,manager_name = '${manager_name}'` +
            `,remark = '${remark}' ,lat = ${lat} ,lon = ${lon} WHERE operating_unit_id = '${operating_unit_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            console.log(r2);
            res.send({ code: true, message: "Operating unit uโpdate error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.update_pharmacy = async (req, res) => {
    let pharmacy_id = req.body['pharmacy_id']
    let name = req.body['name']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let contact_name = req.body['contact_name']
    let contact_tel = req.body['contact_tel']
    let medicine = req.body['medicine']
    let medical_supply = req.body['medical_supply']
    let medical_equipment = req.body['medical_equipment']
    let disaster_equipment = req.body['disaster_equipment']
    let remark = req.body['remark']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT pharmacy_id FROM pharmacy WHERE pharmacy_id = '${pharmacy_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: 'Pharmacy ID not found' })
    } else {
        let sql2 = `UPDATE pharmacy SET name = '${name}' ,address = '${address}' ,tambon = '${amphur}' ,amphur = '${amphur}' ,province = '${province}' ` +
            `,postcode = '${postcode}' ,contact_name = '${contact_name}' ,contact_tel = '${contact_tel}' ,medicine ='${medicine}' ,medical_supply = '${medical_supply}'` +
            `,medical_equipment = '${medical_equipment}' ,disaster_equipment = '${disaster_equipment}' ,remark = '${remark}' ,lat=${lat} ,lon = ${lon}` +
            ` WHERE pharmacy_id = '${pharmacy_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            console.log(r2);
            res.send({ code: true, message: "Pharmacy update error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.update_volunteer = async (req, res) => {
    let volunteer_id = req.body['volunteer_id']
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let now_address = req.body['now_address']
    let now_tambon = req.body['now_tambon']
    let now_amphur = req.body['now_amphur']
    let now_province = req.body['now_province']
    let now_postcode = req.body['now_postcode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let operating_unit_id = req.body['operating_unit_id']
    let contact_number = req.body['contact_number']
    let training = req.body['training']
    let skill = req.body['skill']
    let note = req.body['note']
    let img = req.body['img']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT * FROM volunteer_master WHERE volunteer_id = '${volunteer_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: 'volunteer ID not found' })
    } else {
        let sql2 = `UPDATE volunteer_master SET name_prefix = '${name_prefix}' ,name = '${name}' ,surname = '${surname}' ,card_id = '${card_id}' ,now_address = '${now_address}'` +
            `,now_tambon = '${now_tambon}' ,now_amphur = '${now_amphur}',now_province = '${now_province}',now_postcode = '${now_postcode}' ,card_address = '${card_address}'` +
            `,card_tambon = '${card_tambon}' ,card_amphur = '${card_amphur}' ,card_province = '${card_province}' ,card_postcode = '${card_postcode}'` +
            `,operating_unit_id = '${operating_unit_id}' ,contact_number = '${contact_number}' ,training = '${training}' ,skill = '${skill}' ,note = '${note}' ,img = '${img}'` +
            `,lat = ${lat} ,lon = ${lon} WHERE volunteer_id = '${volunteer_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            console.log(r2);
            res.send({ code: true, message: "volunteer_master update error" })
        } else {
            res.send({ code: false })
        }
    }

}

exports.update_professional = async (req, res) => {
    let professional_id = req.body['professional_id']
    let professional_prefix = req.body['professional_prefix']
    let professional_name = req.body['professional_name']
    let professional_surname = req.body['professional_surname']
    let operating_unit_id = req.body['operating_unit_id']
    let special_expert = req.body['special_expert']
    let career = req.body['career']
    let card_id = req.body['card_id']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let card_address = req.body['card_address']
    let card_tambon = req.body['card_tambon']
    let card_amphur = req.body['card_amphur']
    let card_province = req.body['card_province']
    let card_postcode = req.body['card_postcode']
    let tel = req.body['tel']
    let photo = req.body['photo']
    let lat = req.body['lat']
    let lon = req.body['lat']
    let sql1 = `SELECT * FROM professional WHERE professional_id = '${professional_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: 'volunteer ID not found' })
    } else {
        let sql2 = `UPDATE professional SET professional_prefix = '${professional_prefix}' , professional_name = '${professional_name}' ,professional_surname = '${professional_surname}'` +
            `,operating_unit_id = '${operating_unit_id}' ,special_expert = '${special_expert}' ,career = '${career}' ,card_id = '${card_id}' ,address = '${address}'` +
            `,tambon = '${tambon}' ,amphur = '${amphur}' ,province = '${province}' ,postcode = '${postcode}' ,card_address = '${card_address}' ,card_tambon = '${card_tambon}'` +
            `,card_amphur = '${card_amphur}' ,card_province = '${card_province}' ,card_postcode = '${card_postcode}' ,tel = '${tel}' ,photo = '${photo}' , lat = '${lat}' ,lon = '${lon}'`
                ` WHERE professional_id = '${professional_id}'`
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code) {
            console.log(r2);
            res.send({ code: true, message: "professional update error" })
        } else {
            res.send({ code: false })
        }
    }
}

exports.update_vehicle = async (req, res) => {
    let vehicle_id = req.body['vehicle_id']
    let std_vehicle_id = req.body['std_vehicle_id']
    let vehicle_book_id = req.body['vehicle_book_id']
    let possessor_type = req.body['possessor_type']
    let possessor_organize_name = req.body['possessor_organize_name']
    let possessor_prefix = req.body['possessor_prefix']
    let possessor_name = req.body['possessor_name']
    let possessor_surname = req.body['possessor_surname']
    let vehicle_check_year = req.body['vehicle_check_year']
    let driver1 = req.body['driver1']
    let driver2 = req.body['driver2']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let operating_unit_id = req.body['operating_unit_id']
    let department_type = req.body['department_type']
    let vehicle_type = req.body['vehicle_type']
    let vehicle_using_type = req.body['vehicle_using_type']
    let work_zone = req.body['work_zone']
    let parking_point = req.body['parking_point']
    let license_issue_date = req.body['license_issue_date'] = req.body['license_issue_date'] == '' ? "NULL" : `'${req.body['license_issue_date']}'`
    let license_expire_date = req.body['license_expire_date'] = req.body['license_expire_date'] == '' ? "NULL" : `'${req.body['license_expire_date']}'`
    let result = req.body['result']
    let plate_register_date = req.body['plate_register_date'] = req.body['plate_register_date'] == '' ? "NULL" : `'${req.body['plate_register_date']}'`
    let plate_number = req.body['plate_number']
    let plate_province = req.body['plate_province']
    let car_type = req.body['car_type']
    let vehicle_style = req.body['vehicle_style']
    let brand_name = req.body['brand_name']
    let car_model = req.body['car_model']
    let car_generation_year = req.body['car_generation_year']
    let car_color = req.body['car_color']
    let chassis_no = req.body['chassis_no']
    let chassis_position = req.body['chassis_position']
    let engine_brand = req.body['engine_brand']
    let engine_no = req.body['engine_no']
    let engine_no_position = req.body['engine_no_position']
    let fuel = req.body['fuel']
    let gas_no = req.body['gas_no']
    let piston_count = req.body['piston_count'] = req.body['piston_count'] == '' ? "NULL" : req.body['piston_count']
    let piston_displacement = req.body['piston_displacement'] = req.body['piston_displacement'] == '' ? "NULL" : req.body['piston_displacement']
    let horse_power = req.body['horse_power'] = req.body['horse_power'] == '' ? "NULL" : req.body['horse_power']
    let axle_count = req.body['axle_count'] = req.body['axle_count'] == '' ? "NULL" : req.body['axle_count']
    let tire_count = req.body['tire_count'] = req.body['tire_count'] == '' ? "NULL" : req.body['tire_count']
    let car_weight = req.body['car_weight'] = req.body['car_weight'] == '' ? "NULL" : req.body['car_weight']
    let container_weight = req.body['container_weight'] = req.body['container_weight'] == '' ? "NULL" : req.body['container_weight']
    let total_weight = req.body['total_weight'] = req.body['total_weight'] == '' ? "NULL" : req.body['total_weight']
    let font_img = req.body['font_img']
    let back_img = req.body['back_img']
    let left_img = req.body['left_img']
    let right_img = req.body['right_img']
    let inner_img = req.body['inner_img']
    let possesion_date = req.body['possesion_date'] = req.body['possesion_date'] == '' ? "NULL" : `'${req.body['possesion_date']}'`
    let owner_name = req.body['owner_name']
    let owner_card_id = req.body['owner_card_id']
    let owner_bod = req.body['owner_bod'] = req.body['owner_bod'] == '' ? "NULL" : `'${req.body['owner_bod']}'`
    let owner_nationality = req.body['owner_nationality']
    let owner_address = req.body['owner_address']
    let owner_tel = req.body['owner_tel']
    let rental_agreement_no = req.body['rental_agreement_no']
    let rent_date = req.body['rent_date'] = req.body['rent_date'] == '' ? "NULL" : `'${req.body['rent_date']}'`
    let draff_date = req.body['draff_date'] = req.body['draff_date'] == '' ? "NULL" : `'${req.body['draff_date']}'`
    let edit_date = req.body['edit_date'] = req.body['edit_date'] == '' ? "NULL" : `'${req.body['edit_date']}'`
    let data_status = req.body['data_status']
    let outside_data_reference = req.body['outside_data_reference']
    let source_data = req.body['source_data']
    let sql1 = `SELECT * FROM vehicle_master WHERE vehicle_id = '${vehicle_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.data.length == 0) {
        res.send({ code: true, message: 'vehicle ID not found' })
    } else {
        let sql3 = `SELECT * FROM vehicle_master WHERE std_vehicle_id = '${std_vehicle_id}'`
        let r3 = await pgcon.get(null, sql3, config.connectionString())
        if (r3.code) {
            res.send({ code: r3.code, message: r3.message })
        } else {
            if (r3.data.length > 0) {
                res.send({ code: true, message: "std_vehicle_id is duplicated" })
            } else {
                let sql2 = `UPDATE vehicle_master SET std_vehicle_id = '${std_vehicle_id}' ,vehicle_book_id = '${vehicle_book_id}' ,possessor_type = '${possessor_type}'` +
                    `,possessor_organize_name = '${possessor_organize_name}' ,possessor_prefix = '${possessor_prefix}' ,possessor_name = '${possessor_name}' ,possessor_surname = '${possessor_surname}'` +
                    `,vehicle_check_year = '${vehicle_check_year}' ,driver1 = '${driver1}' ,driver2 = '${driver2}' ,address = '${address}' ,tambon = '${tambon}'` +
                    `,amphur = '${amphur}' ,province = '${province}',operating_unit_id = '${operating_unit_id}' ,department_type = '${department_type}' ,vehicle_type = '${vehicle_type}' ,vehicle_using_type = '${vehicle_using_type}'` +
                    `,work_zone = '${work_zone}' ,parking_point = '${parking_point}' ,license_issue_date = ${license_issue_date} ,license_expire_date = ${license_expire_date}` +
                    `,result = '${result}' ,plate_register_date = ${plate_register_date} ,plate_number = '${plate_number}' ,plate_province = '${plate_province}'` +
                    `,car_type = '${car_type}' ,vehicle_style = '${vehicle_style}' ,brand_name = '${brand_name}' ,car_model = '${car_model}' ,car_generation_year = '${car_generation_year}'` +
                    `,car_color = '${car_color}'  ,chassis_no = '${chassis_no}' ,chassis_position = '${chassis_position}' ,engine_brand = '${engine_brand}'` +
                    `,engine_no = '${engine_no}' ,engine_no_position = '${engine_no_position}' ,fuel = '${fuel}' ,gas_no = '${gas_no}' ,piston_count = ${piston_count} ` +
                    `,piston_displacement = ${piston_displacement} ,horse_power = ${horse_power} ,axle_count = ${axle_count} ,tire_count = ${tire_count} ,car_weight = ${car_weight}` +
                    `,container_weight = ${container_weight} ,total_weight = ${total_weight} ,font_img = '${font_img}' ,back_img = '${back_img}' ,left_img = '${left_img}'` +
                    `,right_img = '${right_img}' ,inner_img = '${inner_img}' ,possesion_date = ${possesion_date} ,owner_name = '${owner_name}' ,owner_card_id ='${owner_card_id}'` +
                    `,owner_bod = ${owner_bod} ,owner_nationality = '${owner_nationality}' ,owner_address = '${owner_address}' ,owner_tel = '${owner_tel}'` +
                    `,rental_agreement_no = '${rental_agreement_no}' ,rent_date = ${rent_date} ,draff_date=${draff_date} ,edit_date=${edit_date} ,data_status = '${data_status}' ` +
                    `,outside_data_reference = '${outside_data_reference}' ,source_data = '${source_data}'` +
                    ` WHERE vehicle_id = '${vehicle_id}' `
                let r2 = await pgcon.execute(null, sql2, config.connectionString())
                if (r2.code) {
                    console.log(r2);
                    res.send({ code: true, message: "vehicle_master update error" })
                } else {
                    res.send({ code: false })
                }
            }
        }

    }
}

exports.add_hospital = async (req, res) => {
    let hospital_name = req.body['hospital_name']
    let under_status = req.body['under_status']
    let hospital_type = req.body['hospital_type']
    let bed_count = req.body['bed_count']
    let potential = req.body['potential']
    let tel = req.body['tel']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT hospital_id FROM hospital_master WHERE hospital_name = '${hospital_name}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length > 0)
            res.send({ code: -1, message: "Duplicated name" });
        else {
            sql1 = `SELECT count FROM increment_id WHERE type = 'hospital_master'`
            r1 = await pgcon.get(null, sql1, config.connectionString())
            let last_count = r1.data[0].count
            last_count++
            let sql3 = `SELECT * FROM hospital_master WHERE hospital_name = '${hospital_name}'`
            let r3 = await pgcon.get(null, sql3, config.connectionString())
            if (r3.code) {
                res.send({ code: r3.code, message: r1.message })
            } else {
                if (r3.data.length > 0) {
                    res.send({ code: -1, message: "Duplicated name" })
                } else {
                    let sql2 = `INSERT INTO hospital_master(hospital_id,hospital_name,under_status,hospital_type,bed_count,potential,tel` +
                        `,address,tambon,amphur,province,postcode,lat,lon) VALUES ('${last_count}','${hospital_name}','${under_status}'` +
                        `,'${hospital_type}','${bed_count}','${potential}','${tel}','${address}','${tambon}','${amphur}','${province}','${postcode}',${lat},${lon});` +
                        `UPDATe increment_id SET count = count + 1 WHERE type = 'hospital_master'`
                    let r2 = await pgcon.execute(null, sql2, config.connectionString())
                    if (r2.code)
                        res.send({ code: r2.code, message: r2.message })
                    else {
                        res.send({ code: false })
                    }
                }
            }

        }
    }
}

exports.update_hospital = async (req, res) => {
    let hospital_id = req.body['hospital_id']
    let hospital_name = req.body['hospital_name']
    let under_status = req.body['under_status']
    let hospital_type = req.body['hospital_type']
    let bed_count = req.body['bed_count']
    let potential = req.body['potential']
    let tel = req.body['tel']
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let sql1 = `SELECT hospital_id FROM hospital_master WHERE hospital_id = '${hospital_id}' `
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "not found" });
        else {
            sql1 = `SELECT hospital_id FROM hospital_master WHERE hospital_name = '${hospital_name}' AND hospital_id != '${hospital_id}'`
            r1 = await pgcon.get(null, sql1, config.connectionString())
            if (r1.code) {
                res.send({ code: r1.code, message: r1.message })
            } else {
                if (r1.data.length > 0)
                    res.send({ code: -1, message: "Duplicated name" });
                else {
                    let sql2 = `UPDATE hospital_master SET hospital_name = '${hospital_name}' , under_status = '${under_status}' ` +
                        `,hospital_type = '${hospital_type}' ,bed_count = ${bed_count} ,potential = '${potential}' ,tel = '${tel}' ,address = '${address}' ` +
                        `,tambon = '${tambon}' ,amphur = '${amphur}' ,province = '${province}' ,postcode = '${postcode}' ,lat = ${lat} ,lon = ${lon} ` +
                        `WHERE hospital_id = '${hospital_id}' `
                    let r2 = await pgcon.execute(null, sql2, config.connectionString())
                    if (r2.code)
                        res.send({ code: r2.code, message: r2.message })
                    else {
                        res.send({ code: false })
                    }
                }
            }
        }
    }
}

exports.add_patient = async (req, res) => {
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let birth_date = req.body['birth_date'] == "" ? "NULL" : `'${req.body['birth_date']}'`
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let home_tel = req.body['home_tel']
    let mobile_tel = req.body['mobile_tel']
    let nationality = req.body['nationality']
    let race = req.body['race']
    let marital = req.body['marital']
    let blood_type = req.body['blood_type']
    let treatment_rights = req.body['treatment_rights']
    let congenital_disease = req.body['congenital_disease']
    let main_medicine = req.body['main_medicine']
    let main_hospital = req.body['main_hospital']
    let doctor_name = req.body['doctor_name']
    let doctor_tel = req.body['doctor_tel']
    let allergic = req.body['allergic']
    let serious_illness_type = req.body['serious_illness_type']
    let contact_name = req.body['contact_name']
    let contact_status = req.body['contact_status']
    let contact_address = req.body['contact_address']
    let contact_no = req.body['contact_no']
    let sql1 = `SELECT patient_id FROM patient_master WHERE card_id = '${card_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {

    } else {
        if (r1.data.length > 0) {
            res.send({ code: -1, message: "Card id is already register" })
        } else {
            let sql2 = `SELECT count FROM increment_id WHERE type = 'patient_master'`
            r1 = await pgcon.get(null, sql2, config.connectionString())
            let last_count = r1.data[0].count
            last_count++
            let sql3 = `INSERT INTO patient_master(patient_id,name_prefix,name,surname,card_id,birth_date,address,tambon,amphur,province,postcode,lat,lon` +
                `,home_tel,mobile_tel,nationality,race,marital,blood_type,treatment_rights,congenital_disease,main_medicine` +
                `,main_hospital,doctor_name,doctor_tel,allergic,serious_illness_type,contact_name,contact_status,contact_address,contact_no)  VALUES ` +
                `('${last_count}','${name_prefix}','${name}','${surname}','${card_id}',${birth_date},'${address}','${tambon}','${amphur}','${province}'` +
                `,'${postcode}',${lat},${lon},'${home_tel}','${mobile_tel}','${nationality}','${race}','${marital}','${blood_type}'` +
                `,'${treatment_rights}','${congenital_disease}','${main_medicine}','${main_hospital}','${doctor_name}'` +
                `,'${doctor_tel}','${allergic}','${serious_illness_type}','${contact_name}','${contact_status}','${contact_address}','${contact_no}');` +
                `UPDATE increment_id SET count = count + 1 WHERE type = 'patient_master'`
            let r3 = await pgcon.execute(null, sql3, config.connectionString())
            if (r3.code) {
                res.send({ code: true, message: "patient master insert failed" })
            } else {
                res.send({ code: false })
            }
        }
    }
}

exports.update_patient = async (req, res) => {
    let patient_id = req.body['patient_id']
    let name_prefix = req.body['name_prefix']
    let name = req.body['name']
    let surname = req.body['surname']
    let card_id = req.body['card_id']
    let birth_date = req.body['birth_date'] == "" ? "NULL" : `'${req.body['birth_date']}'`
    let address = req.body['address']
    let tambon = req.body['tambon']
    let amphur = req.body['amphur']
    let province = req.body['province']
    let postcode = req.body['postcode']
    let lat = req.body['lat'] == '' ? "NULL" : req.body['lat']
    let lon = req.body['lon'] == '' ? "NULL" : req.body['lon']
    let home_tel = req.body['home_tel']
    let mobile_tel = req.body['mobile_tel']
    let nationality = req.body['nationality']
    let race = req.body['race']
    let marital = req.body['marital']
    let blood_type = req.body['blood_type']
    let treatment_rights = req.body['treatment_rights']
    let congenital_disease = req.body['congenital_disease']
    let main_medicine = req.body['main_medicine']
    let main_hospital = req.body['main_hospital']
    let doctor_name = req.body['doctor_name']
    let doctor_tel = req.body['doctor_tel']
    let allergic = req.body['allergic']
    let serious_illness_type = req.body['serious_illness_type']
    let contact_name = req.body['contact_name']
    let contact_status = req.body['contact_status']
    let contact_address = req.body['contact_address']
    let contact_no = req.body['contact_no']
    let sql1 = `SELECT patient_id FROM patient_master WHERE patient_id = '${patient_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "not found" });
        else {
            sql1 = `SELECT patient_id FROM patient_master WHERE card_id = '${card_id}' AND patient_id != '${patient_id}' `
            r1 = await pgcon.get(null, sql1, config.connectionString())
            if (r1.code) {
                res.send({ code: r1.code, message: r1.message })
            } else {
                if (r1.data.length > 0)
                    res.send({ code: -1, message: "Duplicated name" });
                else {
                    let sql2 = `UPDATE patient_master SET name_prefix = '${name_prefix}' ,name = '${name}' ,surname = '${surname}' ,card_id = '${card_id}'` +
                        `,birth_date = ${birth_date} ,address = '${address}' ,tambon = '${tambon}' ,amphur = '${amphur}' ,province = '${province}'` +
                        `,postcode = '${postcode}' ,lat = ${lat} ,lon = ${lon} ,home_tel = '${home_tel}' ,mobile_tel = '${mobile_tel}' ,nationality = '${nationality}'` +
                        `,race = '${race}' ,marital = '${marital}' ,blood_type = '${blood_type}' ,treatment_rights = '${treatment_rights}' ` +
                        `,congenital_disease = '${congenital_disease}' ,main_medicine = '${main_medicine}' ` +
                        `,main_hospital = '${main_hospital}' ,doctor_name = '${doctor_name}' ,doctor_tel = '${doctor_tel}' ,allergic = '${allergic}' ` +
                        `,serious_illness_type = '${serious_illness_type}' ,contact_name = '${contact_name}' ,contact_status = '${contact_status}' ` +
                        `,contact_address = '${contact_address}' ,contact_no = '${contact_no}' ` +
                        `WHERE patient_id = '${patient_id}'`
                    let r2 = await pgcon.execute(null, sql2, config.connectionString())
                    if (r2.code)
                        res.send({ code: r2.code, message: r2.message })
                    else {
                        res.send({ code: false })
                    }
                }
            }
        }
    }
}

exports.add_consult = async (req, res) => {
    let name = req.body['name']
    let surname = req.body['surname']
    let gender = req.body['gender']
    let age = req.body['age']
    let career = req.body['career']
    let tel = req.body['tel']
    let content_type = req.body['content_type']
    let content_etc = req.body['content_etc']
    let remark = req.body['remark']
    let marital_status = req.body['marital_status']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'consult'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let sql2 = `INSERT INTO consult_master(consult_id,name,surname,gender,age,career,tel,content_type,content_etc,remark,consult_time,marital_status) VALUES ` +
        ` ('${last_count}','${name}','${surname}','${gender}','${age}','${career}','${tel}','${content_type}','${content_etc}'` +
        `,'${remark}','${moment().format("YYYY-MM-DD HH:mm:ss")}','${marital_status}');` +
        `UPDATE increment_id SET count = count + 1 WHERE type = 'consult'`
    let r3 = await pgcon.execute(null, sql2, config.connectionString())
    if (r3.code) {
        res.send({ code: true, message: "consult master insert failed" })
    } else {
        res.send({ code: false })
    }
}

exports.update_consult = async (req, res) => {
    let consult_id = req.body['consult_id']
    let name = req.body['name']
    let surname = req.body['surname']
    let gender = req.body['gender']
    let age = req.body['age']
    let career = req.body['career']
    let tel = req.body['tel']
    let content_type = req.body['content_type']
    let content_etc = req.body['content_etc']
    let remark = req.body['remark']
    let marital_status = req.body['marital_status']
    let sql1 = `UPDATE consult_master SET name = '${name}' ,surname = '${surname}' ,gender = '${gender}' ,age = '${age}' ,career = '${career}' ,tel = '${tel}' ` +
        `,content_type = '${content_type}' ,content_etc = '${content_etc}' ,remark = '${remark}' ,marital_status='${marital_status}' WHERE consult_id = '${consult_id}'`
    let r1 = await pgcon.execute(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: true, message: "consult master update failed" })
    } else {
        res.send({ code: false })
    }
}

exports.get_consult = async (req, res) => {
    let sql1 = `SELECT * FROM consult_master`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        res.send({ code: false, data: r1.data })
    }
}

exports.delete_consult = async (req, res) => {
    let consult_id = req.query['consult_id']
    let sql1 = `DELETE FROM consult_master WHERE consult_id = '${consult_id}'`
    let r1 = await pgcon.execute(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: true, message: "consult master delete failed" })
    } else {
        res.send({ code: false })
    }
}

exports.add_emergency_reported = async (req, res) => {
    let reporter_type = req.body['reporter_type'] == undefined ? "null" : `'${req.body['reporter_type']}'`
    let reporter_type_etc = req.body['reporter_type_etc'] == undefined ? "null" : `'${req.body['reporter_type_etc']}'`
    let how_to_report = req.body['how_to_report'] == undefined ? "null" : `'${req.body['how_to_report']}'`
    let how_to_report_etc = req.body['how_to_report_etc'] == undefined ? "null" : `'${req.body['how_to_report_etc']}'`
    let event_type = req.body['event_type'] == undefined ? "null" : `'${req.body['event_type']}'`
    let reporter_name = req.body['reporter_name'] == undefined ? "null" : `'${req.body['reporter_name']}'`
    let reporter_surname = req.body['reporter_surname'] == undefined ? "null" : `'${req.body['reporter_surname']}'`
    let reporter_tel = req.body['reporter_tel'] == undefined ? "null" : `'${req.body['reporter_tel']}'`
    let reporter_frequency = req.body['reporter_frequency'] == undefined ? "null" : `'${req.body['reporter_frequency']}'`
    let patient_name = req.body['patient_name'] == undefined ? "null" : `'${req.body['patient_name']}'`
    let patient_surname = req.body['patient_surname'] == undefined ? "null" : `'${req.body['patient_surname']}'`
    let patient_age = req.body['patient_age'] == undefined ? "null" : `'${req.body['patient_age']}'`
    let patient_gender = req.body['patient_gender'] == undefined ? "null" : `'${req.body['patient_gender']}'`
    let basic_illness = req.body['basic_illness'] == undefined ? "null" : `'${req.body['basic_illness']}'`
    let place_detail = req.body['place_detail'] == undefined ? "null" : `'${req.body['place_detail']}'`
    let location_name = req.body['location_name'] == undefined ? "null" : `'${req.body['location_name']}'`
    let lat = req.body['lat'] == undefined ? "null" : `${req.body['lat']}`
    let lon = req.body['lon'] == undefined ? "null" : `${req.body['lon']}`
    let zone = req.body['zone'] == undefined || req.body['zone'] == '' ? "null" : `${req.body['zone']}`
    let screening_id = req.body['screening_id'] == undefined ? "null" : `${req.body['screening_id']}`
    let screening_detail = req.body['screening_detail'] == undefined ? "null" : `screening_detail = '${req.body['screening_detail']}'`
    let screening_lv = req.body['screening_lv'] == undefined ? "null" : `${req.body['screening_lv']}`
    let screening_no = req.body['screening_no'] == undefined ? "null" : `${req.body['screening_no']}`
    let receiver_name = req.body['receiver_name'] == undefined ? "null" : `${req.body['receiver_name']}`
    let today = new Date()
    let bd_year = today.getFullYear()
    bd_year = (bd_year + 543).toString().slice(-2);
    let sql2 = `SELECT count FROM increment_id WHERE type = 'emergency_reported_id'`
    let r2 = await pgcon.get(null, sql2, config.connectionString())
    let last_id = r2.data[0].count
    last_id++
    let sql3 = `INSERT INTO emergency_master (emergency_reported_id,reporter_type,how_to_report,event_type,reporter_name,reporter_surname,reporter_tel,reporter_frequency` +
        `,patient_name,patient_surname,patient_age,patient_gender,basic_illness,place_detail,location_name,lat,lon,zone,screening_id,screening_detail,screening_lv,screening_no` +
        `,reported_time,receiver_name) VALUES (${last_id},${reporter_type},${how_to_report}` +
        `,${event_type},${reporter_name},${reporter_surname},${reporter_tel},${reporter_frequency},${patient_name},${patient_surname},${patient_age}` +
        `,${patient_gender},${basic_illness},${place_detail},${location_name},${lat},${lon},${zone},${screening_id},${screening_detail},${screening_lv}` +
        `,${screening_no},'${moment().format("YYYY-MM-DD HH:mm:ss")}',${receiver_name});` +
        ` UPDATE increment_id SET count = count + 1 WHERE type = 'emergency_reported_id'`
    let r3 = await pgcon.execute(null, sql3, config.connectionString())
    if (r3.code) {
        res.send({ code: true, message: "emergency_master insert failed" })
    } else {
        res.send({ code: false })
    }
}

exports.update_emergency_reported = async (req, res) => {
    let emergency_reported_id = req.body['emergency_reported_id']
    let reporter_type = req.body['reporter_type'] == undefined ? null : `reporter_type = '${req.body['reporter_type']}'`
    let reporter_type_etc = req.body['reporter_type_etc'] == undefined ? null : `reporter_type_etc = '${req.body['reporter_type_etc']}'`
    let how_to_report = req.body['how_to_report'] == undefined ? null : `how_to_report = '${req.body['how_to_report']}'`
    let how_to_report_etc = req.body['how_to_report_etc'] == undefined ? null : `how_to_report_etc = '${req.body['how_to_report_etc']}'`
    let event_type = req.body['event_type'] == undefined ? null : `event_type = '${req.body['event_type']}'`
    let reporter_name = req.body['reporter_name'] == undefined ? null : `reporter_name = '${req.body['reporter_name']}'`
    let reporter_surname = req.body['reporter_surname'] == undefined ? null : `reporter_surname = '${req.body['reporter_surname']}'`
    let reporter_tel = req.body['reporter_tel'] == undefined ? null : `reporter_tel = '${req.body['reporter_tel']}'`
    let reporter_frequency = req.body['reporter_frequency'] == undefined ? null : `reporter_frequency = '${req.body['reporter_frequency']}'`
    let patient_name = req.body['patient_name'] == undefined ? null : `patient_name = '${req.body['patient_name']}'`
    let patient_surname = req.body['patient_surname'] == undefined ? null : `patient_surname = '${req.body['patient_surname']}'`
    let patient_age = req.body['patient_age'] == undefined ? null : `patient_age = '${req.body['patient_age']}'`
    let patient_gender = req.body['patient_gender'] == undefined ? null : `patient_gender = '${req.body['patient_gender']}'`
    let basic_illness = req.body['basic_illness'] == undefined ? null : `basic_illness = '${req.body['basic_illness']}'`
    let place_detail = req.body['place_detail'] == undefined ? null : `place_detail = '${req.body['place_detail']}'`
    let location_name = req.body['location_name'] == undefined ? null : `location_name = '${req.body['location_name']}'`
    let lat = req.body['lat'] == undefined ? null : `lat = ${req.body['lat']}`
    let lon = req.body['lon'] == undefined ? null : `lon = ${req.body['lon']}`
    let zone = req.body['zone'] == undefined ? null : `zone = ${req.body['zone']}`
    let screening_id = req.body['screening_id'] == undefined ? null : `screening_id = ${req.body['screening_id']}`
    let screening_detail = req.body['screening_detail'] == undefined ? null : `screening_detail = '${req.body['screening_detail']}'`
    let screening_lv = req.body['screening_lv'] == undefined ? null : `screening_lv = ${req.body['screening_lv']}`
    let screening_no = req.body['screening_no'] == undefined ? null : `screening_no = ${req.body['screening_no']}`
    let receiver_name = req.body['receiver_name'] == undefined ? null : `receiver_name = ${req.body['receiver_name']}`
    let sql1 = `SELECT emergency_reported_id FROM emergency_master WHERE emergency_reported_id = '${emergency_reported_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "not found" });
        else {
            let updatevalue = [reporter_type, reporter_type_etc, how_to_report, how_to_report_etc, event_type, reporter_name, reporter_surname, reporter_tel,
                reporter_frequency, patient_name, patient_surname, patient_age, patient_gender, basic_illness, place_detail, location_name, lat, lon, zone,
                screening_id, screening_detail, screening_lv, screening_no, receiver_name].filter(x => x != null)
            updatevalue = updatevalue.join()
            let sql2 = `UPDATE emergency_master SET ${updatevalue} WHERE emergency_reported_id = ${emergency_reported_id}`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
            // reporter_type = '${reporter_type}' ,reporter_type_etc = '${reporter_type_etc}' ,how_to_report = '${how_to_report}'` +
            // `,how_to_report_etc = '${how_to_report_etc}' ,event_type = '${event_type}' ,reporter_name = '${reporter_name}' ,reporter_surname = '${reporter_surname}'` +
            // `,reporter_tel = '${reporter_tel}' ,reporter_frequency = '${reporter_frequency}' ,patient_name = '${patient_name}' ,patient_surname = '${patient_surname}' ` +
            // `,patient_age = '${patient_age}' ,patient_gender = '${patient_gender}' ,basic_illness = '${basic_illness}' ,place_detail = '${place_detail}' ` +
            // `,location_name = '${location_name}' ,lat = '${lat}' ,lon = '${lon}' ,zone = '${zone}' ,screening_id = '${screening_id}' ,screening_detail = '${screening_detail}'` +
            // `,screening_lv = ${screening_lv} ,screening_no = ${screening_no} ,receiver_name = '${receiver_name}' 
        }
    }
}

exports.command_operating_unit = async (req, res) => {
    let emergency_reported_id = req.body['emergency_reported_id']
    let operating_unit_id = req.body['operating_unit_id']
    let value = ``
    if (operating_unit_id.length == 0)
        res.send({ code: -1, message: "No operating_unit_id" });
    else {
        operating_unit_id = [...new Set(operating_unit_id)]
        value = operating_unit_id.map(x => `('${emergency_reported_id}','${x}')`)
    }
    let sql1 = `INSERT INTO waiting_master(emergency_reported_id,operating_unit_id) VALUES ` + value.join()
    let r1 = await pgcon.execute(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        res.send({ code: false })
    }
}





exports.get_new_operation_id = async (req, res) => {
    let emergency_reported_id = req.body['emergency_reported_id']
    let operator_name = req.body['operator_name']
    let cancel_status = req.body['cancel_status']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'operation_id'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_count = r1.data[0].count
    last_count++
    let today = new Date()
    let bd_year = today.getFullYear()
    let operation_id = (bd_year + 543).toString().slice(2, 4) + "-" + ("000000" + last_count).slice(-5);
    let sql2 = `UPDATE emergency_master SET operation_id = '${operation_id}' , operator_name = '${operator_name}' ,cancel_status = '${cancel_status}' WHERE emergency_reported_id = '${emergency_reported_id}';` +
        `UPDATE increment_id SET count = count + 1 WHERE type = 'operation_id';DELETE FROM waiting_master WHERE WHERE emergency_reported_id = '${emergency_reported_id}';` +
        `INSERT INTO operation_master(operation_id,command_time) VALUES ('${operation_id}','${moment().format("YYYY-MM-DD HH:mm:ss")}');`
    let r2 = await pgcon.execute(null, sql2, config.connectionString())
    if (r2.code)
        res.send({ code: r2.code, message: r2.message })
    else {
        res.send({ code: false })
    }
}

exports.get_getjob = async (req, res) => {
    let operating_unit_id = req.body['operating_unit_id']
    let filter = operating_unit_id == undefined || operating_unit_id == '' ? '' : ` WHERE e.operating_unit_id = '${operating_unit_id}'`
    let sql1 = `SELECT e.emergency_reported_id ,e.lat , e.lon ,e.receiver_name , e.reporter_tel, e.reported_time ,e.location_name ,e.patient_age ` +
        `, ou.operating_unit_name , s.symptom ,e.operating_unit_id ,e.cancel_status ,e.screening_id as main_symptom,e.screening_no ,e.screening_lv ,om.* FROM emergency_master e ` +
        `LEFT JOIN screening_minor s ON s.screening_id = e.screening_id AND e.screening_lv = s.screening_lv AND e.screening_no = s.screening_no ` +
        ` LEFT JOIN operating_unit ou ON ou.operating_unit_id = e.operating_unit_id LEFT JOIN operation_master om ON om.operation_id = e.operation_id` +
        filter + ` ORDER BY e.reported_time`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        let temp = r1.data.map(x => {
            x.reported_time = moment(x.reported_time).format("YYYY-MM-DD HH:mm:ss")
            return x
        })
        res.send({ code: false, data: temp })
    }
}

exports.get_emergency_reported = async (req, res) => {
    let command = req.query['command']
    let where = command != undefined ? ` WHERE e.operation_id IS NULL` : ''
    let sql1 = `SELECT e.* , m.cure_result ,s.symptom ,sm.* FROM emergency_master e LEFT JOIN operation_master m ON m.operation_id = e.operation_id ` +
        ` LEFT JOIN screening_minor s ON e.screening_id = s.screening_id AND e.screening_lv = s.screening_lv AND e.screening_no = s.screening_no ` +
        ` LEFT JOIN screening_master sm ON e.screening_id = sm.screening_id ` + where + ` ORDER BY e.reported_time`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        r1.data = r1.data.map(x => {
            x.reported_date = moment(x.reported_time).format("YYYY-MM-DD")
            x.reported_time = moment(x.reported_time).format("HH:mm:ss")
            x.red_question = unescape(x.red_question == null ? "" : x.red_question)
            x.yellow_question = unescape(x.yellow_question == null ? "" : x.yellow_question)
            x.green_question = unescape(x.green_question == null ? "" : x.green_question)
            x.white_question = unescape(x.white_question == null ? "" : x.white_question)
            x.black_question = unescape(x.black_question == null ? "" : x.black_question)
            x.recommend_command = unescape(x.recommend_command == null ? "" : x.recommend_command)
            return x
        })
        res.send({ code: false, data: r1.data })
    }
}

exports.get_patient_master = async (req, res) => {
    let sql1 = `SELECT * FROM patient_master ORDER BY patient_id`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_hospital_master = async (req, res) => {
    let sql1 = `SELECT * FROM hospital_master ORDER BY hospital_id`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: false, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_compensate = async (req, res) => {
    let sql = 'SELECT * FROM compensate_master'
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.update_compensate = async (req, res) => {
    let data = req.body
    data = data.map(x => {
        x.type = `'${x.type}'`
        return `(${x.type},${x.red},${x.yellow},${x.green},${x.cancel})`
    })
    let sql = `UPDATE compensate_master as m SET red = c.red , yellow = c.yellow , green = c.green , cancel = c.cancel ` +
        ` FROM (VALUES ${data.join()}) as c(type,red,yellow,green,cancel) WHERE m.type = c.type`
    let r1 = await pgcon.execute(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false })
    }
}

exports.get_advice = async (req, res) => {
    let sql = 'SELECT * FROM operation_advice'
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        let temp = r1.data.map(x => {
            x.screening_advice = unescape(x.screening_advice)
            x.command_advice = unescape(x.command_advice)
            x.reported_advice = unescape(x.reported_advice)
            return x
        })
        res.send({ code: false, data: temp })
    }
}

exports.update_advice = async (req, res) => {
    let screening = req.body['screening']
    let command = req.body['command']
    let reported = req.body['reported']
    screening = escape(screening)
    command = escape(command)
    reported = escape(reported)
    let sql = `UPDATE operation_advice SET screening_advice = '${screening}' , command_advice = '${command}' , reported_advice = '${reported}'`
    let r1 = await pgcon.execute(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false })
    }
}

exports.get_mainsymptom = async (req, res) => {
    let sql = `SELECT * FROM screening_master`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_ready_hospital = async (req, res) => {
    let sql = `SELECT r.* , h.hospital_name FROM ready_hospital r LEFT JOIN hospital_master h ON r.hospital_id = h.hospital_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.get_ready_operatingunit = async (req, res) => {
    let sql = `SELECT r.* , o.operating_unit_name FROM ready_operatingunit r LEFT JOIN operating_unit o ON r.operating_unit_id = o.operating_unit_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        res.send({ code: false, data: r1.data })
    }
}

exports.add_ready_operatingunit = async (req, res) => {
    let operating_unit_id = req.body['operating_unit_id']
    let start_date = req.body['start_date']
    let end_date = req.body['end_date']
    let reason = req.body['reason']
    let detail = req.body['detail']
    let sql1 = `SELECT * FROM ready_operatingunit WHERE operating_unit_id = '${operating_unit_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        let date_arr = r1.data.filter(x => moment(x.start_date).format("YYYY-MM-DD HH:mm:ss") != moment(start_date).format("YYYY-MM-DD HH:mm:ss")
            && moment(x.end_date).format("YYYY-MM-DD HH:mm:ss") != moment(end_date).format("YYYY-MM-DD HH:mm:ss"))
        date_arr = date_arr.filter(x => {
            let start_check = moment(start_date).isBetween(x.start_date, x.end_date)
            let start_check2 = moment(x.start_date).isBetween(start_date, end_date)
            let end_check = moment(end_date).isBetween(x.start_date, x.end_date)
            let end_check2 = moment(x.end_date).isBetween(start_date, end_date)
            return start_check || start_check2 || end_check || end_check2;
        })
        if (date_arr.length > 0) {
            res.send({ code: -1, message: "Date is override" })
        } else {
            let sql2 = `INSERT INTO ready_operatingunit(operating_unit_id,start_date,end_date,reason,detail) VALUES ` +
                `('${operating_unit_id}','${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}','${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}','${reason}','${detail}')`
            let r3 = await pgcon.execute(null, sql2, config.connectionString())
            if (r3.code) {
                res.send({ code: true, message: "ready_operatingunit insert failed" })
            } else {
                res.send({ code: false })
            }
        }


    }
}

exports.add_ready_hospital = async (req, res) => {
    let hospital_id = req.body['hospital_id']
    let start_date = req.body['start_date']
    let end_date = req.body['end_date']
    let reason = req.body['reason']
    let detail = req.body['detail']
    let sql1 = `SELECT * FROM ready_hospital WHERE hospital_id = '${hospital_id}'` +
        ` AND start_date <= '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}' AND end_date > '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        let date_arr = r1.data.filter(x => moment(x.start_date).format("YYYY-MM-DD HH:mm:ss") != moment(start_date).format("YYYY-MM-DD HH:mm:ss")
            && moment(x.end_date).format("YYYY-MM-DD HH:mm:ss") != moment(end_date).format("YYYY-MM-DD HH:mm:ss"))
        date_arr = date_arr.filter(x => {
            let start_check = moment(start_date).isBetween(x.start_date, x.end_date)
            let start_check2 = moment(x.start_date).isBetween(start_date, end_date)
            let end_check = moment(end_date).isBetween(x.start_date, x.end_date)
            let end_check2 = moment(x.end_date).isBetween(start_date, end_date)
            return start_check || start_check2 || end_check || end_check2;
        })
        if (date_arr.length > 0) {
            res.send({ code: -1, message: "Date is override" })
        } else {
            let sql2 = `INSERT INTO ready_hospital(hospital_id,start_date,end_date,reason,detail) VALUES ` +
                `(${hospital_id},'${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}','${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}','${reason}','${detail}')`
            let r3 = await pgcon.execute(null, sql2, config.connectionString())
            if (r3.code) {
                res.send({ code: true, message: "ready_hospital insert failed" })
            } else {
                res.send({ code: false })
            }
        }
    }
}

exports.update_ready_operatingunit = async (req, res) => {
    let operating_unit_id = req.body['operating_unit_id']
    let start_date = req.body['start_date']
    let end_date = req.body['end_date']
    let new_start_date = req.body['new_start_date']
    let new_end_date = req.body['new_end_date']
    let reason = req.body['reason']
    let detail = req.body['detail']
    let sql1 = `SELECT * FROM ready_operatingunit WHERE operating_unit_id = '${operating_unit_id}' `
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0) {
            res.send({ code: -1, message: "Operation unit id not exist" })
        } else {
            let date_arr = r1.data.filter(x => moment(x.start_date).format("YYYY-MM-DD HH:mm:ss") != moment(start_date).format("YYYY-MM-DD HH:mm:ss")
                && moment(x.end_date).format("YYYY-MM-DD HH:mm:ss") != moment(end_date).format("YYYY-MM-DD HH:mm:ss"))
            date_arr = date_arr.filter(x => {
                let start_check = moment(new_start_date).isBetween(x.start_date, x.end_date)
                let start_check2 = moment(x.start_date).isBetween(new_start_date, new_end_date)
                let end_check = moment(new_end_date).isBetween(x.start_date, x.end_date)
                let end_check2 = moment(x.end_date).isBetween(new_start_date, new_end_date)
                return start_check || start_check2 || end_check || end_check2;
            })
            if (date_arr.length > 0) {
                res.send({ code: -1, message: "Date is override" })
            } else {
                let sql2 = `UPDATE ready_operatingunit SET start_date = '${moment(new_start_date).format("YYYY-MM-DD HH:mm:ss")}' ,end_date = '${moment(new_end_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
                    `,reason = '${reason}' ,detail = '${detail}' WHERE operating_unit_id = '${operating_unit_id}' AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
                    ` AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
                let r2 = await pgcon.execute(null, sql2, config.connectionString())
                if (r2.code) {
                    res.send({ code: r2.code, message: "ready_operatingunit update failed" })
                } else {
                    res.send({ code: false })
                }
            }
        }
    }
}

exports.update_ready_hospital = async (req, res) => {
    let hospital_id = req.body['hospital_id']
    let start_date = req.body['start_date']
    let end_date = req.body['end_date']
    let new_start_date = req.body['new_start_date']
    let new_end_date = req.body['new_end_date']
    let reason = req.body['reason']
    let detail = req.body['detail']
    let sql1 = `SELECT * FROM ready_hospital WHERE hospital_id = '${hospital_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0) {
            res.send({ code: -1, message: "Hospital id not exist" })
        } else {
            let date_arr = r1.data.filter(x => moment(x.start_date).format("YYYY-MM-DD HH:mm:ss") != moment(start_date).format("YYYY-MM-DD HH:mm:ss")
                && moment(x.end_date).format("YYYY-MM-DD HH:mm:ss") != moment(end_date).format("YYYY-MM-DD HH:mm:ss"))
            date_arr = date_arr.filter(x => {
                let start_check = moment(new_start_date).isBetween(x.start_date, x.end_date)
                let start_check2 = moment(x.start_date).isBetween(new_start_date, new_end_date)
                let end_check = moment(new_end_date).isBetween(x.start_date, x.end_date)
                let end_check2 = moment(x.end_date).isBetween(new_start_date, new_end_date)
                return start_check || start_check2 || end_check || end_check2;
            })
            if (date_arr.length > 0) {
                res.send({ code: -1, message: "Date is override" })
            } else {
                let sql2 = `UPDATE ready_hospital SET start_date = '${moment(new_start_date).format("YYYY-MM-DD HH:mm:ss")}' ,end_date = '${moment(new_end_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
                    `,reason = '${reason}' ,detail = '${detail}' WHERE hospital_id = ${hospital_id} AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
                    ` AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
                let r3 = await pgcon.execute(null, sql2, config.connectionString())
                if (r3.code) {
                    res.send({ code: true, message: "ready_hospital update failed" })
                } else {
                    res.send({ code: false })
                }
            }

        }
    }
}

exports.add_new_main_symptom = async (req, res) => {
    let screening_name = req.body['screening_name']
    let sql1 = `SELECT count FROM increment_id WHERE type = 'screening_master'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    let last_id = r1.data[0].count
    last_id++
    let sql2 = `INSERT INTO screening_master(screening_id , screening_name) VALUES (${last_id},'${screening_name}');` +
        `UPDATE increment_id SET count = count + 1 WHERE type = 'screening_master'`
    let r2 = await pgcon.execute(null, sql2, config.connectionString())
    if (r2.code) {
        res.send({ code: r2.code, message: "main_symptom insert failed" })
    } else {
        res.send({ code: false })
    }
}

exports.delete_main_symptom = async (req, res) => {
    let screening_id = req.body['screening_id']
    let sql1 = `SELECT * FROM screening_master WHERE screening_id = ${screening_id}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "screening id error" })
        else {
            let sql2 = `DELETE FROM screening_master WHERE screening_id = ${screening_id};` +
                `DELETE FROM screening_minor WHERE screening_id = ${screening_id};`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
        }
    }
}

exports.delete_ready_operatingunit = async (req, res) => {
    let operating_unit_id = req.query['operating_unit_id']
    let start_date = req.query['start_date']
    let end_date = req.query['end_date']
    let sql1 = `SELECT * FROM ready_operatingunit WHERE operating_unit_id = '${operating_unit_id}' AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
        ` AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        let sql2 = `DELETE FROM ready_operatingunit  WHERE operating_unit_id = '${operating_unit_id}' ` +
            `AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}'  AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
        let r3 = await pgcon.execute(null, sql2, config.connectionString())
        if (r3.code) {
            res.send({ code: true, message: "ready_operatingunit delete failed" })
        } else {
            res.send({ code: false })
        }

    }
}

exports.delete_ready_hospital = async (req, res) => {
    let hospital_id = req.query['hospital_id']
    let start_date = req.query['start_date']
    let end_date = req.query['end_date']
    let sql1 = `SELECT * FROM ready_hospital WHERE hospital_id = '${hospital_id}' AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}' ` +
        ` AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        let sql2 = `DELETE FROM ready_hospital  WHERE hospital_id = '${hospital_id}' ` +
            `AND start_date = '${moment(start_date).format("YYYY-MM-DD HH:mm:ss")}'  AND end_date = '${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}'`
        let r3 = await pgcon.execute(null, sql2, config.connectionString())
        if (r3.code) {
            res.send({ code: true, message: "ready_hospital delete failed" })
        } else {
            res.send({ code: false })
        }

    }
}

exports.get_screening_detail = async (req, res) => {
    let screening_id = req.query['screening_id']
    let sql1 = `SELECT red_question , yellow_question, green_question , white_question , black_question ,recommend_command FROM screening_master ` +
        `WHERE screening_id = ${screening_id}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        let sql2 = `SELECT * FROM screening_minor WHERE screening_id = ${screening_id}`
        let r2 = await pgcon.get(null, sql2, config.connectionString())
        if (r2.code)
            res.send({ code: r2.code, message: r2.message })
        else {
            if (r1.data.length == 0)
                res.send({ code: -1, data: [] })
            else {
                let result = {
                    red_question: unescape(r1.data[0].red_question == null ? "" : r1.data[0].red_question),
                    yellow_question: unescape(r1.data[0].yellow_question == null ? "" : r1.data[0].yellow_question),
                    green_question: unescape(r1.data[0].green_question == null ? "" : r1.data[0].green_question),
                    white_question: unescape(r1.data[0].white_question == null ? "" : r1.data[0].white_question),
                    black_question: unescape(r1.data[0].black_question == null ? "" : r1.data[0].black_question),
                    recommend_command: unescape(r1.data[0].recommend_command == null ? "" : r1.data[0].recommend_command),
                    minor: r2.data
                }
                res.send({ code: false, data: result })
            }
        }
    }
}


exports.add_screening_minor = async (req, res) => {
    let screening_id = req.body['screening_id']
    let screening_lv = req.body['screening_lv']
    let symptom = req.body['symptom']
    let sql1 = `SELECT MAX(screening_no) as last_id FROM screening_minor WHERE screening_id = ${screening_id} AND screening_lv = ${screening_lv}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        let sql2 = ``
        if (r1.data.length == 0)
            sql2 = `INSERT INTO screening_minor(screening_id,screening_lv,screening_no,symptom) VALUES (${screening_id},${screening_lv},1,'${symptom}')`
        else {
            let last_id = r1.data[0].last_id
            last_id++
            sql2 = `INSERT INTO screening_minor(screening_id,screening_lv,screening_no,symptom) VALUES (${screening_id},${screening_lv},${last_id},'${symptom}')`
        }
        let r2 = await pgcon.execute(null, sql2, config.connectionString())
        if (r2.code)
            res.send({ code: r2.code, message: r2.message })
        else
            res.send({ code: false })
    }
}

exports.add_screening_question = async (req, res) => {
    let screening_id = req.body['screening_id']
    let red_question = req.body['red_question']
    let yellow_question = req.body['yellow_question']
    let green_question = req.body['green_question']
    let white_question = req.body['white_question']
    let black_question = req.body['black_question']
    let recommend_command = req.body['recommend_command']
    let sql1 = `SELECT * FROM screening_master WHERE screening_id = ${screening_id}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1.message })
    else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "Screening id not found" })
        else {
            let sql2 = `UPDATE screening_master SET red_question='${escape(red_question)}' ,yellow_question='${escape(yellow_question)}' ` +
                `,green_question='${escape(green_question)}' ,white_question='${escape(white_question)}' ,black_question='${escape(black_question)}'` +
                `,recommend_command='${escape(recommend_command)}' WHERE screening_id = ${screening_id}`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
        }
    }
}

exports.delete_minor_symptom = async (req, res) => {
    let screening_id = req.query['screening_id']
    let screening_no = req.query['screening_no']
    let screening_lv = req.query['screening_lv']
    let sql1 = `SELECT * FROM screening_minor WHERE screening_id = ${screening_id} AND screening_lv = ${screening_lv} AND screening_no = ${screening_no}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1 })
    else {
        if (r1.data.legnth == 0)
            res.send({ code: -1, message: "Symptom id not found" })
        else {
            let sql2 = `DELETE FROM screening_minor WHERE screening_id = ${screening_id} AND screening_lv = ${screening_lv} AND screening_no = ${screening_no}`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
        }
    }
}

exports.update_minor_symptom = async (req, res) => {
    let screening_id = req.body['screening_id']
    let screening_no = req.body['screening_no']
    let screening_lv = req.body['screening_lv']
    let symptom = req.body['symptom']
    let sql1 = `SELECT * FROM screening_minor WHERE screening_id = ${screening_id} AND screening_lv = ${screening_lv} ` +
        `AND screening_no = ${screening_no}`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1 })
    else {
        if (r1.data.legnth == 0)
            res.send({ code: -1, message: "Symptom id not found" })
        else {
            let sql2 = `UPDATE screening_minor SET symptom = '${symptom}' WHERE screening_id = ${screening_id} AND ` +
                ` screening_lv = ${screening_lv} AND screening_no = ${screening_no}`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
        }
    }
}

exports.tokencheck = (req, res) => {
    var token = req.body['x-access-token'];
    console.log(token);
    if (!token) {
        console.log("no token");
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if (!decoded.gen_token.card_id) return res.status(500).send({ auth: false, message: 'Card ID not found' });
        let sql = `SELECT card_id,name_prefix,name,surname,role_id,email FROM user_master WHERE card_id = '${decoded.gen_token.card_id}'`
        let r1 = await pgcon.get(null, sql, config.connectionString())
        if (r1.code) {
            res.status(500).send({ auth: false, message: r1.message });
        } else {
            if (r1.data.length == 0) {
                res.status(401).send({ auth: false, message: 'No user account in Medical server.' });
            } else {
                let temp = r1.data[0]
                let token = jwt.sign(temp, config.secret, { expiresIn: 1800 });
                res.status(200).send(token);
            }
        }
    });
}


exports.tokencheckself = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        console.log("no token");
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        decoded.auth = true
        next()
    });
}


exports.get_usermaster = async (req, res) => {
    let sql = `SELECT u.* , o.operating_unit_name FROM user_master u LEFT JOIN operating_unit o ON u.operating_unit_id = o.operating_unit_id`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1 })
    } else {
        if (r1.data.legnth == 0)
            res.send({ code: -1, message: "user_master id not found" })
        else {
            res.send({ code: false, data: r1.data })
        }
    }
}

exports.get_screening_minor = async (req, res) => {
    let sql = `SELECT * FROM screening_minor`
    let r1 = await pgcon.get(null, sql, config.connectionString())
    if (r1.code)
        res.send({ code: r1.code, message: r1 })
    else {
        if (r1.data.legnth == 0)
            res.send({ code: -1, message: "Symptom id not found" })
        else {
            res.send({ code: false, data: r1.data })
        }
    }
}

exports.update_operation_master = async (req, res) => {
    let operation_id = req.body['operation_id']
    if (!operation_id) return res.send({ code: -1, message: "no operation ID" })

    let car_type = req.body['car_type'] == undefined || req.body['car_type'] == '' ? null : `car_type = '${req.body['car_type']}' `
    let perform_place = req.body['perform_place'] == undefined || req.body['perform_place'] == '' ? null : `perform_place = '${req.body['perform_place']}' `
    let zone = req.body['zone'] == undefined || req.body['zone'] == '' ? null : `zone = ${req.body['zone']} `
    let police_office = req.body['police_office'] == undefined || req.body['police_office'] == '' ? null : `police_office = '${req.body['police_office']}' `
    let plate_number = req.body['plate_number'] == undefined || req.body['plate_number'] == '' ? null : `plate_number = '${req.body['plate_number']}'`
    let officer1 = req.body['officer1'] == undefined || req.body['officer1'] == '' ? null : `officer1 = '${req.body['officer1']}' `
    let officer2 = req.body['officer2'] == undefined || req.body['officer2'] == '' ? null : `officer2 = '${req.body['officer2']}' `
    let officer3 = req.body['officer3'] == undefined || req.body['officer3'] == '' ? null : `officer3 = '${req.body['officer3']}' `
    let officer4 = req.body['officer4'] == undefined || req.body['officer4'] == '' ? null : `officer4 = '${req.body['officer4']}' `
    let perform_result = req.body['perform_result'] == undefined || req.body['perform_result'] == '' ? null : `perform_result = '${req.body['perform_result']}'`
    let perform_inside_zone = req.body['perform_inside_zone'] == undefined || req.body['perform_inside_zone'] == '' ? null : `perform_inside_zone = '${req.body['perform_inside_zone']}' `
    let place_detail = req.body['place_detail'] == undefined || req.body['place_detail'] == '' ? null : `place_detail = '${req.body['place_detail']}' `
    let screening_id = req.body['screening_id'] == undefined || req.body['screening_id'] == '' ? null : `screening_id = ${req.body['screening_id']} `
    let screening_lv = req.body['screening_lv'] == undefined || req.body['screening_lv'] == '' ? null : `screening_lv = ${req.body['screening_lv']} `
    let screening_no = req.body['screening_no'] == undefined || req.body['screening_no'] == '' ? null : `screening_no = ${req.body['screening_no']} `
    let command_time = req.body['command_time'] == undefined || req.body['command_time'] == '' ? null : `command_time = '${moment(req.body['command_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let leave_base_time = req.body['leave_base_time'] == undefined || req.body['leave_base_time'] == '' ? null : `leave_base_time = '${moment(req.body['leave_base_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let arrive_accident_time = req.body['arrive_accident_time'] == undefined || req.body['arrive_accident_time'] == '' ? null : `arrive_accident_time = '${moment(req.body['arrive_accident_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let leave_accident_time = req.body['leave_accident_time'] == undefined || req.body['leave_accident_time'] == '' ? null : `leave_accident_time = '${moment(req.body['leave_accident_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let arrive_hospital_time = req.body['arrive_hospital_time'] == undefined || req.body['arrive_hospital_time'] == '' ? null : `arrive_hospital_time = '${moment(req.body['arrive_hospital_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let arrive_base_time = req.body['arrive_base_time'] == undefined || req.body['arrive_base_time'] == '' ? null : `arrive_base_time = '${moment(req.body['arrive_base_time']).format("YYYY-MM-DD HH:mm:ss")}'`
    let patient_name_prefix = req.body['patient_name_prefix'] == undefined || req.body['patient_name_prefix'] == '' ? null : `patient_name_prefix = '${req.body['patient_name_prefix']}'`
    let patient_name = req.body['patient_name'] == undefined || req.body['patient_name'] == '' ? null : `patient_name = '${req.body['patient_name']}'`
    let patient_surname = req.body['patient_surname'] == undefined || req.body['patient_surname'] == '' ? null : `patient_surname = '${req.body['patient_surname']}'`
    let patient_age = req.body['patient_age'] == undefined || req.body['patient_age'] == '' ? null : `patient_age = ${req.body['patient_age']}`
    let patient_month = req.body['patient_month'] == undefined || req.body['patient_month'] == '' ? null : `patient_month = ${req.body['patient_month']}`
    let patient_gender = req.body['patient_gender'] == undefined || req.body['patient_gender'] == '' ? null : `patient_gender = '${req.body['patient_gender']}'`
    let patient_nation = req.body['patient_nation'] == undefined || req.body['patient_nation'] == '' ? null : `patient_nation = '${req.body['patient_nation']}'`
    let patient_country = req.body['patient_country'] == undefined || req.body['patient_country'] == '' ? null : `patient_country = '${req.body['patient_country']}'`
    let patient_card_id = req.body['patient_card_id'] == undefined || req.body['patient_card_id'] == '' ? null : `patient_card_id = '${req.body['patient_card_id']}'`
    let treatment_right = req.body['treatment_right'] == undefined || req.body['treatment_right'] == '' ? null : `treatment_right = '${req.body['treatment_right']}'`
    let private_insurance = req.body['private_insurance'] == undefined || req.body['private_insurance'] == '' ? null : `private_insurance = '${req.body['private_insurance']}'`
    let primary_result = req.body['primary_result'] == undefined || req.body['primary_result'] == '' ? null : `primary_result = '${req.body['primary_result']}'`
    let patient_img1 = req.body['patient_img1'] == undefined || req.body['patient_img1'] == '' ? null : `patient_img1 = '${req.body['patient_img1']}'`
    let patient_img2 = req.body['patient_img2'] == undefined || req.body['patient_img2'] == '' ? null : `patient_img2 = '${req.body['patient_img2']}'`
    let patient_img3 = req.body['patient_img3'] == undefined || req.body['patient_img3'] == '' ? null : `patient_img3 = '${req.body['patient_img3']}'`
    let patient_img4 = req.body['patient_img4'] == undefined || req.body['patient_img4'] == '' ? null : `patient_img4 = '${req.body['patient_img4']}'`
    let hospital_name = req.body['hospital_name'] == undefined || req.body['hospital_name'] == '' ? null : `hospital_name = '${req.body['hospital_name']}'`
    let hospital_type = req.body['hospital_type'] == undefined || req.body['hospital_type'] == '' ? null : `hospital_type = '${req.body['hospital_type']}'`
    let hospital_reason = req.body['hospital_reason'] == undefined || req.body['hospital_reason'] == '' ? null : `hospital_reason = '${req.body['hospital_reason']}'`
    let sending_hn = req.body['sending_hn'] == undefined || req.body['sending_hn'] == '' ? null : `sending_hn = '${req.body['sending_hn']}'`
    let sending_diagnose = req.body['sending_diagnose'] == undefined || req.body['sending_diagnose'] == '' ? null : `sending_diagnose = '${req.body['sending_diagnose']}'`
    let sending_lv = req.body['sending_lv'] == undefined || req.body['sending_lv'] == '' ? null : `sending_lv = '${req.body['sending_lv']}'`
    let sending_breating = req.body['sending_breating'] == undefined || req.body['sending_breating'] == '' ? null : `sending_breating = '${req.body['sending_breating']}'`
    let sending_bleeding = req.body['sending_bleeding'] == undefined || req.body['sending_bleeding'] == '' ? null : `sending_bleeding = '${req.body['sending_bleeding']}'`
    let sending_bone = req.body['sending_bone'] == undefined || req.body['sending_bone'] == '' ? null : `sending_bone = '${req.body['sending_bone']}'`
    let diagnose_name = req.body['diagnose_name'] == undefined || req.body['diagnose_name'] == '' ? null : `diagnose_name = '${req.body['diagnose_name']}'`
    let diagnose_role = req.body['diagnose_role'] == undefined ? null : `diagnose_role = '${req.body['diagnose_role']}'`
    let admit_status = req.body['admit_status'] == undefined || req.body['admit_status'] == '' ? null : `admit_status = '${req.body['admit_status']}'`
    let admit_day = req.body['admit_day'] == undefined || req.body['admit_day'] == '' ? null : `admit_day = ${req.body['admit_day']}`
    let admit_result = req.body['admit_result'] == undefined || req.body['admit_result'] == '' ? null : `admit_result = '${req.body['admit_result']}'`
    let follower_name = req.body['follower_name'] == undefined || req.body['follower_name'] == '' ? null : `follower_name = '${req.body['follower_name']}' `
    let follow_date = req.body['follow_date'] == undefined || req.body['follow_date'] == '' ? null : `follow_date = '${moment(req.body['follow_date']).format("YYYY-MM-DD")}' `
    let cure_result = req.body['cure_result'] == undefined || req.body['cure_result'] == '' ? null : `cure_result = '${req.body['cure_result']}' `
    let cure_reason = req.body['cure_reason'] == undefined || req.body['cure_reason'] == '' ? null : `cure_reason = '${req.body['cure_reason']}' `
    let sending_watering = req.body['sending_watering'] == undefined || req.body['sending_watering'] == '' ? null : `sending_watering = '${req.body['sending_watering']}' `
    let bone_status = req.body['bone_status'] == undefined || req.body['bone_status'] == '' ? null : `bone_status = '${req.body['bone_status']}' `
    let accident_type = req.body['accident_type'] == undefined || req.body['accident_type'] == '' ? null : `accident_type = '${req.body['accident_type']}' `
    let pulse_time = req.body['pulse_time'] == undefined || req.body['pulse_time'] == '' ? null : `pulse_time = '${req.body['pulse_time']}' `
    let pulse_count = req.body['pulse_count'] == undefined || req.body['pulse_count'] == '' ? null : `pulse_count = ${req.body['pulse_count']} `
    let breathing_count = req.body['breathing_count'] == undefined || req.body['breathing_count'] == '' ? null : `breathing_count = ${req.body['breathing_count']} `
    let pressure_count = req.body['pressure_count'] == undefined || req.body['pressure_count'] == '' ? null : `pressure_count = '${req.body['pressure_count']}' `
    let sense_status = req.body['sense_status'] == undefined || req.body['sense_status'] == '' ? null : `sense_status = '${req.body['sense_status']}' `
    let breathing_status = req.body['breathing_status'] == undefined || req.body['breathing_status'] == '' ? null : `breathing_status = '${req.body['breathing_status']}' `
    let wound_status = req.body['wound_status'] == undefined || req.body['wound_status'] == '' ? null : `wound_status = '${req.body['wound_status']}' `
    let treat_breath = req.body['treat_breath'] == undefined || req.body['treat_breath'] == '' ? null : `treat_breath = '${req.body['treat_breath']}' `
    let treat_bleeding = req.body['treat_bleeding'] == undefined || req.body['treat_bleeding'] == '' ? null : `treat_bleeding = '${req.body['treat_bleeding']}' `
    let treat_bone = req.body['treat_bone'] == undefined || req.body['treat_bone'] == '' ? null : `treat_bone = '${req.body['treat_bone']}' `
    let cpr_status = req.body['cpr_status'] == undefined || req.body['cpr_status'] == '' ? null : `cpr_status = '${req.body['cpr_status']}' `

    let sql1 = `SELECT operation_id FROM operation_master WHERE operation_id = '${operation_id}'`
    let r1 = await pgcon.get(null, sql1, config.connectionString())
    if (r1.code) {
        res.send({ code: r1.code, message: r1.message })
    } else {
        if (r1.data.length == 0)
            res.send({ code: -1, message: "not found" });
        else {
            let updatevalue = [car_type, pulse_time, pulse_count, breathing_count, pressure_count, sense_status, breathing_status, wound_status, treat_breath, treat_bleeding
                , perform_place, treat_bone, cpr_status
                , zone
                , police_office
                , plate_number
                , officer1
                , officer2
                , officer3
                , officer4
                , perform_result
                , perform_inside_zone
                , place_detail
                , screening_id
                , command_time
                , leave_base_time
                , arrive_accident_time
                , leave_accident_time
                , arrive_hospital_time
                , arrive_base_time
                , patient_name_prefix
                , patient_name
                , patient_surname
                , patient_age
                , patient_month
                , patient_gender
                , patient_nation
                , patient_country
                , patient_card_id
                , treatment_right
                , private_insurance
                , primary_result
                , patient_img1
                , patient_img2
                , patient_img3
                , patient_img4
                , hospital_name
                , hospital_type
                , hospital_reason
                , sending_hn
                , sending_diagnose
                , sending_lv
                , sending_breating
                , sending_bleeding
                , sending_bone
                , diagnose_name
                , diagnose_role
                , admit_status
                , admit_day
                , admit_result
                , follower_name
                , follow_date
                , cure_result
                , cure_reason
                , screening_lv, sending_watering
                , screening_no, bone_status, accident_type].filter(x => x != null)

            updatevalue = updatevalue.join()
            let sql2 = `UPDATE operation_master SET ${updatevalue} WHERE operation_id = '${operation_id}'`
            let r2 = await pgcon.execute(null, sql2, config.connectionString())
            if (r2.code)
                res.send({ code: r2.code, message: r2.message })
            else {
                res.send({ code: false })
            }
        }
    }
}


