
 
 

 

/// <reference path="Enums.ts" />

declare namespace DotWeb.Api.AppLoginController {
	interface GridAccount {
		account: string;
		company_sn: number;
		CompanyName: string;
		CompanyPhone: string;
		CusName: string;
		kitcount: number;
		MobilePhone1: string;
		MobilePhone2: string;
		name: string;
		state: string;
	}
}
declare namespace DotWeb.WebApp.Models.JsonWebParam {
	interface WebParam {
		field: string;
		key: string;
		sort: string;
		type: string;
		value: any;
		valuetype: string;
	}
}


