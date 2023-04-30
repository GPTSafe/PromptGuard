"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsKnownAttack = void 0;
const attackDenyList = [
    "ignore above",
    "ignore the above",
    "ignore previous instructions",
    "ignore the previous instructions",
    "ignore above instructions",
    "ignore instructions above",
    "ignore the above instructions",
    "ignore above directions",
    "ignore directions above",
    "ignore the above directions",
    "ignore the previous directions",
    "ignore previous directions",
];
function containsKnownAttack(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        prompt = prompt.toLocaleLowerCase();
        for (const attack of attackDenyList) {
            if (prompt.includes(attack)) {
                return true;
            }
        }
        return false;
    });
}
exports.containsKnownAttack = containsKnownAttack;
