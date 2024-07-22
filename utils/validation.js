const validator = require('validator')


const messages = [
    { key: "isEmpty", message: "Is required" },
    { key: "isEmail", message: "Please Enter Valid Email" },
    { key: "isMobilePhone", message: "Please Enter Valid Mobile Number" },
    { key: "isStrongPassword", message: "Please Enter Strong Password" },
]


exports.ValidationNew = (res, data = [{ value: "rahulmahato0852@gmail.com", keyname: "filed", validations: [{ key: "isEmpty", except: false }, { key: "isEmail", except: true }] }]) => {
    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < data[i].validations.length; j++) {

            const validation = data[i].validations[j];

            const result = validator[validation.key](data[i].value);

            if (result !== validation.except) {
                const messageObj = messages.find(item => item.key === validation.key);
                console.log(messageObj);
                res.status(400).json({ message: validation.key === "isEmpty" ? keyname + messageObj.message : messageObj.message })
                return true
            }
        }
    }
    return false;
}

