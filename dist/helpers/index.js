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
exports.containsDenyListItems = void 0;
function containsDenyListItems(prompt, userDenyList, ignoreDefaultDenyList) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            prompt = prompt.toLowerCase();
        }
        catch (_a) {
            throw new Error("prompt could not be converted to lower case");
        }
        const defaultDenyList = [
            "ignore previous instructions",
            "ignore above instructions",
        ];
        let denyList = [""];
        if (userDenyList.length > 1 || userDenyList[0] !== "") {
            if (!ignoreDefaultDenyList) {
                denyList = defaultDenyList.concat(userDenyList);
            }
            if (ignoreDefaultDenyList) {
                denyList = userDenyList;
            }
        }
        if (userDenyList.length === 1 && userDenyList[0] === "") {
            if (!ignoreDefaultDenyList) {
                denyList = defaultDenyList;
            }
        }
        // TODO implement fuzzy matching
        for (const item of denyList) {
            if (prompt.includes(item.toLowerCase())) {
                return true;
            }
        }
        return false;
    });
}
exports.containsDenyListItems = containsDenyListItems;
