import User from "../models/UserModel";

// Creation of users for transits backend
export async function seed() {
  await User.create({
    id: 1,
    username: "pangolino",
    email: "kikopierga@gmail.com",
    password: "12345",
    credit: 50,
    role: "Operatore",
  });

  await User.create({
    id: 2,
    username: "filippo",
    email: "filippochampagne@gmail.com",
    password: "12345",
    credit: 100,
    role: "Automobilista",
  });

  await User.create({
    id: 3,
    username: "nevio",
    email: "neviolostirato@gmail.com",
    password: "stirato",
    credit: 0,
    role: "Admin",
  });

  await User.create({
    id: 4,
    username: "pippo",
    email: "pippolostirato@gmail.com",
    password: "678910",
    credit: 0,
    role: "Varco",
  });
}
