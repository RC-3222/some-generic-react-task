import {MessageTemplate} from "../classes";
import {compileTemplate} from "./compile-template";

// ---------- test group №0 ----------
describe("compile a template with some incorrect input data", () => {

    test("with incorrect variable name specified", () => {
        const template = new MessageTemplate(null, [
            "firstname",
            "lastname",
            "company",
            "position",
        ]);

        template.divideNode(0);
        template.tree!.children![0].text.value = "Hello, {firstname1} {lastname}!";

        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            firstname: "John",
            lastname: "Wayne",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Hello, {firstname1} Wayne!"
        );
    });

    test("with &&(and) operator in IF block", () => {
        const template = new MessageTemplate(null, [
            "firstname",
            "lastname",
            "company",
            "position",
        ]);

        template.divideNode(0);
        template.tree!.children![0].text.value = "Hello, {firstname}!\n";
        template.tree!.children![1].text.value = "{company}&&{position}";
        template.tree!.children![2].text.value = "I know that you currently work at {company} as {position}, but maybe you are interested in NEW job opportunities?\n";
        template.tree!.children![3].text.value = "Could you please share more about you current job?\n";
        template.tree!.children![4].text.value = "Anyway, thank you for reading this and goodbye!";

        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            firstname: "Peter",
            lastname: "Griffin",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Hello, Peter!\nI know that you currently work at  as , but maybe you are interested in NEW job opportunities?\nAnyway, thank you for reading this and goodbye!"
        );
    });
});

// ---------- test group №1 ----------
describe('compile an empty template', () => {
    const template = new MessageTemplate(null, [
        "firstname",
        "lastname",
        "company",
        "position",
    ]);

    test("without any values", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {};

        expect(testCompileFn(template, values)).toEqual("");
    });

    test("with all values set", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            firstname: "Rick",
            lastname: "Sanchez",
            company: "Kremlin",
            position: "Janitor",
        };

        expect(testCompileFn(template, values)).toEqual("");
    });
});

// ---------- test group №2 ----------
describe("compile a simple template (with only 1 IF-THEN-ELSE block present)", () => {
    const template = new MessageTemplate(null, [
        "firstname",
        "lastname",
        "company",
        "position",
    ]);

    template.divideNode(0);
    template.tree!.children![0].text.value = "Hello, {firstname}!\n";
    template.tree!.children![1].text.value = "{company}";
    template.tree!.children![2].text.value = "I know you work at {company}. Could you please help me to land a job there? I need only 300 bucks to pay my bills.\n";
    template.tree!.children![3].text.value = "Could you please tell me your current company's name?\n";
    template.tree!.children![4].text.value = "Anyway, thank you for even reading this in the first place. Goodbye!";

    test("without any values", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {};

        expect(testCompileFn(template, values)).toEqual(
            "Hello, !\nCould you please tell me your current company's name?\nAnyway, thank you for even reading this in the first place. Goodbye!"
        );
    });

    test("with all values set", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            firstname: "Ivan",
            lastname: "Temnoholmov",
            company: "Yandex",
            position: "Senior HR Manager",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Hello, Ivan!\nI know you work at Yandex. Could you please help me to land a job there? I need only 300 bucks to pay my bills.\nAnyway, thank you for even reading this in the first place. Goodbye!"
        );
    });

    test("with only unused (and totally unrelated) values set", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            name: "Boris",
            city: "New York",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Hello, !\nCould you please tell me your current company's name?\nAnyway, thank you for even reading this in the first place. Goodbye!"
        );
    });
});

// ---------- test group №3 ----------
describe("compile a more complex template", () => {
    const template = new MessageTemplate(null, [
        "firstname",
        "lastname",
        "company",
        "position",
    ]);
    template.divideNode(0);
    template.divideNode(3);
    template.tree!.children![0].text.value = "Good morning, Mr. {lastname}!\n";
    template.tree!.children![1].text.value = "{company}";
    template.tree!.children![2].children![0].text.value = "I know you work at {company}";
    template.tree!.children![2].children![1].text.value = "{position}";
    template.tree!.children![2].children![2].text.value = " as {position}...\n";
    template.tree!.children![2].children![3].text.value = ", but what is your current position there?\n";
    template.tree!.children![2].children![4].text.value = "And maybe you are interested in new job opportunities?\n";
    template.tree!.children![3].text.value = "Could you please tell us more about your current job?\n";
    template.tree!.children![4].text.value = "Anyway, thank you for reading this... and goodbye!";

    test("with some values set", () => {
        const testCompileFn = jest.fn(compileTemplate);

        const values = {
            firstname: "Stan",
            lastname: "Smith",
            company: "CIA",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Good morning, Mr. Smith!\nI know you work at CIA, but what is your current position there?\nAnd maybe you are interested in new job opportunities?\nAnyway, thank you for reading this... and goodbye!"
        );
    });


    test("with only 1 value set", () => {
        const testCompileFn = jest.fn(compileTemplate);
        const values = {
            lastname: "Smith",
        };

        expect(testCompileFn(template, values)).toEqual(
            "Good morning, Mr. Smith!\nCould you please tell us more about your current job?\nAnyway, thank you for reading this... and goodbye!"
        );
    });
});
