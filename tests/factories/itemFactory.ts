import { faker } from "@faker-js/faker";

async function item() {

    const item = {
        title: faker.datatype.string(5),
        url: faker.internet.url(),
        description: faker.datatype.string(30),
        amount: faker.datatype.number(99)
    }

    return item;
}

export {
    item
}