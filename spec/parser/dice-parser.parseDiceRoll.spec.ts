import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseDiceRoll", () => {
        it("can correctly parse a simple dice roll with pre-parsed number.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Identifier, 2, "d"),
                new Token(TokenType.Integer, 3, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const num = parser.parseInteger();
            const dice = parser.parseDiceRoll(num);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly parse a simple dice roll with modifier (10d6dl3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Identifier, 2, "d"),
                new Token(TokenType.Integer, 3, "6"),
                new Token(TokenType.Identifier, 4, "dl"),
                new Token(TokenType.Integer, 5, "3"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const dice = parser.parseDiceRoll();
            expect(dice.type).toBe(NodeType.Drop);
            expect(dice.getAttribute("type")).toBe("lowest");
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Dice);
            expect(dice.getChild(1).type).toBe(NodeType.Integer);
        });
        it("can correctly parse a dice roll with a explode modifier (4d6!p>3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Integer, 2, "6"),
                new Token(TokenType.Exclamation, 3, "!"),
                new Token(TokenType.Identifier, 4, "p"),
                new Token(TokenType.Greater, 5, ">"),
                new Token(TokenType.Integer, 6, "3"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseDiceRoll();
            expect(exp.type).toBe(NodeType.Explode);
            expect(exp.getAttribute("compound")).toBe("no");
            expect(exp.getAttribute("penetrate")).toBe("yes");
            expect(exp.getChildCount()).toBe(2);

            const dice = exp.getChild(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);

            const greater = exp.getChild(1);
            expect(greater.type).toBe(NodeType.Greater);
            expect(greater.getChildCount()).toBe(1);
        });
        it("can correctly parse a dice roll with a critical modifier (4d6cs).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Integer, 2, "6"),
                new Token(TokenType.Identifier, 3, "cs")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseDiceRoll();
            expect(exp.type).toBe(NodeType.Critical);
            expect(exp.getAttribute("type")).toBe("success");
            expect(exp.getChildCount()).toBe(1);

            const dice = exp.getChild(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
        });
        it("can correctly parse a dice roll with a keep modifier (4d6kl3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Integer, 2, "6"),
                new Token(TokenType.Identifier, 3, "kl"),
                new Token(TokenType.Integer, 5, "3")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseDiceRoll();
            expect(exp.type).toBe(NodeType.Keep);
            expect(exp.getAttribute("type")).toBe("lowest");
            expect(exp.getChildCount()).toBe(2);

            const dice = exp.getChild(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);

            const low = exp.getChild(1);
            expect(low.type).toBe(NodeType.Integer);
            expect(low.getAttribute("value")).toBe(3);
        });
        it("can correctly parse a dice roll with a reroll modifier (4d6ro>3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Integer, 2, "6"),
                new Token(TokenType.Identifier, 3, "ro"),
                new Token(TokenType.Greater, 5, ">"),
                new Token(TokenType.Integer, 6, "3")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseDiceRoll();
            expect(exp.type).toBe(NodeType.Reroll);
            expect(exp.getAttribute("once")).toBe("yes");
            expect(exp.getChildCount()).toBe(2);

            const dice = exp.getChild(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);

            const greater = exp.getChild(1);
            expect(greater.type).toBe(NodeType.Greater);
            expect(greater.getChildCount()).toBe(1);
        });
        it("can correctly parse a dice roll with a sort modifier (4d6sa).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Integer, 2, "6"),
                new Token(TokenType.Identifier, 3, "sa"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseDiceRoll();
            expect(exp.type).toBe(NodeType.Sort);
            expect(exp.getAttribute("direction")).toBe("ascending");
            expect(exp.getChildCount()).toBe(1);

            const dice = exp.getChild(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
        });
    });
});
