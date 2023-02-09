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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsLanguages = void 0;
const lande_1 = __importDefault(require("lande"));
function containsLanguages(prompt, languages) {
    return __awaiter(this, void 0, void 0, function* () {
        const detectedLanguages = [];
        // lande returns a sorted list of detected languages and their probabilities.
        // for now, we're selecting all languages with a probability greater than 80%
        // this may need to be tuned later
        const landeOuput = (0, lande_1.default)(prompt);
        for (const lang of landeOuput) {
            if (lang[1] > 0.8)
                detectedLanguages.push(lang[0]);
            else
                break;
        }
        for (const lang of detectedLanguages) {
            if (languages.includes(lang))
                return true;
        }
        return false;
    });
}
exports.containsLanguages = containsLanguages;
// export async function validateLanguageList(list: string[]): Promise<boolean> {
//   //foo
//   return true;
// }
