const fs = require('fs');
const XLSX = require("xlsx");

try {
	//read file 
	fs.readFile(__dirname + `/sampleData.json`, 'utf8', function(err, response){
		if (err) {
				console.log("File read failed:", err);
				return;
			}
		let json_data = JSON.parse(response);   //data which is got after read file and convert into json format

		let insertrecord =[];
		json_data.forEach(element => {

			let is_alphanumeric  = /^([a-zA-Z0-9 ]+)$/;  // regex for alphanumeric value. This validation is only for English language
			let is_int  = /[0-9]/;   					 // regex for integer
			let is_email  = /\S+@\S+\.\S+/;              // regex for email
			let address_regex  = /^([a-zA-Z0-9, _-]+)$/;  // regex for address


			let name = `${element.title} ${element.first_name} ${element.last_name}`;
			let address = `${element.location.street}, ${element.location.city}, ${element.location.state} - ${element.location.postcode}`;

			if((is_alphanumeric.test(name)) == false){
				console.log("Error : Name is invalid", name);
				name = ''; // name must be alphanumeric
			}

			if((is_alphanumeric.test(element.username)) == false){
				console.log("Error : username is inavalid", element.username);
				element.username = ''; // username must be alphanumeric
			}

			if((is_email.test(element.email)) == false){
				console.log("Error : Email is invalid", element.email);
				element.email = '';  // email like abc@gmail.com
			}


			if((address_regex.test(address)) == false){
				console.log("Error : Address is inavalid", address);
				address = ''; // address must be alphanumeric
			}

			
			insertrecord.push({
				Name: name,
				Username:element.username,
				Email: element.email,
				Phonenumber: element.phone_number,
				Dateofbirth: element.birthdate,
				Address: address
			})
		});
		
		//generate .excel or .csv file
		const convertjsontoexcel = () => {
				const worksheet = XLSX.utils.json_to_sheet(insertrecord);
				const workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workbook,worksheet,"students");
				XLSX.write(workbook,{bookType:"xlsx",type:"buffer"});
				XLSX.write(workbook,{bookType:"xlsx",type:"binary"});
				XLSX.writeFile(workbook,"userdetail.csv"); // give filename which will be excel or csv
		};

		convertjsontoexcel();
		
	});
} catch (error) {
	console.log("error",error);
}
