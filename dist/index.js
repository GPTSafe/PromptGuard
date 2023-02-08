#!/usr/bin/env ts-node
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
exports.PromptGuard = void 0;
const utils_1 = require("./utils");
var FAILURE_REASON;
(function (FAILURE_REASON) {
    FAILURE_REASON["DENY_LIST"] = "CONTAINS_DENY_LIST_ITEM";
    FAILURE_REASON["MAX_TOKEN_THRESHOLD"] = "EXCEEDS_MAX_TOKEN_THRESHOLD";
    FAILURE_REASON["KNOWN_ATTACK"] = "CONTAINS_KNOWN_ATTACK";
})(FAILURE_REASON || (FAILURE_REASON = {}));
class PromptGuard {
    constructor(userPolicyOptions = {}) {
        const defaultPromptGuardPolicy = {
            maxTokens: 4096,
            denyList: [''],
            disableAttackMitigation: false,
            encodeOutput: false
        };
        // merge the user policy with the default policy to create the policy
        this.promptGuardPolicy = Object.assign(Object.assign({}, defaultPromptGuardPolicy), userPolicyOptions);
    }
    process(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            // processing order
            // normalize -> quote -> escape -> check tokens -> check cache -> check for known attacks -> check allow list -> check deny list -> encode output
            // check the prompt token count
            if ((0, utils_1.countPromptTokens)(prompt) > this.promptGuardPolicy.maxTokens)
                return { pass: false, output: FAILURE_REASON.MAX_TOKEN_THRESHOLD };
            // check prompt against known prompt attacks
            if (!this.promptGuardPolicy.disableAttackMitigation) {
                if (yield (0, utils_1.promptContainsKnownAttack)(prompt))
                    return { pass: false, output: FAILURE_REASON.KNOWN_ATTACK };
            }
            // check prompt again the user defined deny list
            if (yield (0, utils_1.promptContainsDenyListItems)(prompt, this.promptGuardPolicy.denyList))
                return { pass: false, output: FAILURE_REASON.DENY_LIST };
            // encode the prompt output if encodeOutput is set by the user
            if (this.promptGuardPolicy.encodeOutput)
                prompt = (0, utils_1.encodePromptOutput)(prompt);
            return { pass: true, output: prompt };
        });
    }
}
exports.PromptGuard = PromptGuard;
