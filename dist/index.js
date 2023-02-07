#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const helper = __importStar(require("./helpers"));
var Case;
(function (Case) {
    Case[Case["Lower"] = 0] = "Lower";
    Case[Case["Upper"] = 1] = "Upper";
    Case[Case["Sentence"] = 2] = "Sentence";
})(Case || (Case = {}));
class PromptGuard {
    constructor(options = {
        maxTokens: 100,
        quoteInput: true,
        escapeInput: false,
        normalization: {
            normalizeUnicode: true,
            removeAllUnicode: false,
            removeNewLineCharacters: true,
        },
        encodeOutput: false,
    }) {
        if (!(options === null || options === void 0 ? void 0 : options.ignoreDefaultDenyList))
            options.ignoreDefaultDenyList = false;
        if (!(options === null || options === void 0 ? void 0 : options.denyList))
            options.denyList = [""];
        this.options = options;
    }
    process(prompt) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // processing order
            // normalize -> quote -> escape -> check tokens -> check allow list -> check deny list -> encode output
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.denyList) {
                if (typeof ((_b = this.options) === null || _b === void 0 ? void 0 : _b.ignoreDefaultDenyList) === "boolean") {
                    if (yield helper.containsDenyListItems(prompt, this.options.denyList, this.options.ignoreDefaultDenyList))
                        return { pass: false, reason: "Deny list" };
                }
            }
            return { pass: true, output: prompt };
        });
    }
}
exports.PromptGuard = PromptGuard;
