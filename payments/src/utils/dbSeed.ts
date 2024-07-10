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

	User.create({
        id: 2,
        username: "filippo",
        email: "filippochampagne@gmail.com",
        password: "poveri",
        credit: 1000,
        role: "Automobilista",
    });
}

