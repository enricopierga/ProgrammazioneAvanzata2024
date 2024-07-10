import User from "../models/UserModel";

export function seed() {
	if (process.env.CLEAN_DB !== "true") return;

	User.create({
		id: 1,
		username: "pangolino",
		email: "kikopierga@gmail.com",
		password: "12345",
		credit: 100,
		role: "Operatore",
	});
}

