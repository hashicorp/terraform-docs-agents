/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 7240:
/***/ ((module) => {

"use strict";


module.exports = bail

function bail(err) {
  if (err) {
    throw err
  }
}


/***/ }),

/***/ 1291:
/***/ ((module) => {

"use strict";


module.exports = ccount

function ccount(source, character) {
  var value = String(source)
  var count = 0
  var index

  if (typeof character !== 'string') {
    throw new Error('Expected character')
  }

  index = value.indexOf(character)

  while (index !== -1) {
    count++
    index = value.indexOf(character, index + character.length)
  }

  return count
}


/***/ }),

/***/ 8201:
/***/ ((module) => {

"use strict";


module.exports = collapse

// `collapse(' \t\nbar \nbaz\t') // ' bar baz '`
function collapse(value) {
  return String(value).replace(/\s+/g, ' ')
}


/***/ }),

/***/ 8171:
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(3837);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 1997:
/***/ ((module) => {

"use strict";


module.exports = alphabetical

// Check if the given character code, or the character code at the first
// character, is alphabetical.
function alphabetical(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 && code <= 122) /* a-z */ ||
    (code >= 65 && code <= 90) /* A-Z */
  )
}


/***/ }),

/***/ 3497:
/***/ ((module) => {

"use strict";

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return !/[^0-9a-z\xDF-\xFF]/.test(str.toLowerCase());
};


/***/ }),

/***/ 8189:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var alphabetical = __nccwpck_require__(1997)
var decimal = __nccwpck_require__(5552)

module.exports = alphanumerical

// Check if the given character code, or the character code at the first
// character, is alphanumerical.
function alphanumerical(character) {
  return alphabetical(character) || decimal(character)
}


/***/ }),

/***/ 5625:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 5552:
/***/ ((module) => {

"use strict";


module.exports = decimal

// Check if the given character code, or the character code at the first
// character, is decimal.
function decimal(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return code >= 48 && code <= 57 /* 0-9 */
}


/***/ }),

/***/ 7474:
/***/ ((module) => {

"use strict";


module.exports = hexadecimal

// Check if the given character code, or the character code at the first
// character, is hexadecimal.
function hexadecimal(character) {
  var code = typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 /* a */ && code <= 102) /* z */ ||
    (code >= 65 /* A */ && code <= 70) /* Z */ ||
    (code >= 48 /* A */ && code <= 57) /* Z */
  )
}


/***/ }),

/***/ 864:
/***/ ((module) => {

"use strict";


module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};


/***/ }),

/***/ 8473:
/***/ ((module) => {

"use strict";


module.exports = whitespace

var fromCode = String.fromCharCode
var re = /\s/

// Check if the given character code, or the character code at the first
// character, is a whitespace character.
function whitespace(character) {
  return re.test(
    typeof character === 'number' ? fromCode(character) : character.charAt(0)
  )
}


/***/ }),

/***/ 1623:
/***/ ((module) => {

"use strict";


module.exports = wordCharacter

var fromCode = String.fromCharCode
var re = /\w/

// Check if the given character code, or the character code at the first
// character, is a word character.
function wordCharacter(character) {
  return re.test(
    typeof character === 'number' ? fromCode(character) : character.charAt(0)
  )
}


/***/ }),

/***/ 4232:
/***/ ((module) => {

"use strict";


module.exports = longestStreak

// Get the count of the longest repeating streak of `character` in `value`.
function longestStreak(value, character) {
  var count = 0
  var maximum = 0
  var expected
  var index

  if (typeof character !== 'string' || character.length !== 1) {
    throw new Error('Expected character')
  }

  value = String(value)
  index = value.indexOf(character)
  expected = index

  while (index !== -1) {
    count++

    if (index === expected) {
      if (count > maximum) {
        maximum = count
      }
    } else {
      count = 1
    }

    expected = index + 1
    index = value.indexOf(character, expected)
  }

  return maximum
}


/***/ }),

/***/ 8805:
/***/ ((module) => {

"use strict";


module.exports = escapes

var defaults = [
  '\\',
  '`',
  '*',
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '#',
  '+',
  '-',
  '.',
  '!',
  '_',
  '>'
]

var gfm = defaults.concat(['~', '|'])

var commonmark = gfm.concat([
  '\n',
  '"',
  '$',
  '%',
  '&',
  "'",
  ',',
  '/',
  ':',
  ';',
  '<',
  '=',
  '?',
  '@',
  '^'
])

escapes.default = defaults
escapes.gfm = gfm
escapes.commonmark = commonmark

// Get markdown escapes.
function escapes(options) {
  var settings = options || {}

  if (settings.commonmark) {
    return commonmark
  }

  return settings.gfm ? gfm : defaults
}


/***/ }),

/***/ 1062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)

module.exports = markdownTable

var trailingWhitespace = / +$/

// Characters.
var space = ' '
var lineFeed = '\n'
var dash = '-'
var colon = ':'
var verticalBar = '|'

var x = 0
var C = 67
var L = 76
var R = 82
var c = 99
var l = 108
var r = 114

// Create a table from a matrix of strings.
function markdownTable(table, options) {
  var settings = options || {}
  var padding = settings.padding !== false
  var start = settings.delimiterStart !== false
  var end = settings.delimiterEnd !== false
  var align = (settings.align || []).concat()
  var alignDelimiters = settings.alignDelimiters !== false
  var alignments = []
  var stringLength = settings.stringLength || defaultStringLength
  var rowIndex = -1
  var rowLength = table.length
  var cellMatrix = []
  var sizeMatrix = []
  var row = []
  var sizes = []
  var longestCellByColumn = []
  var mostCellsPerRow = 0
  var cells
  var columnIndex
  var columnLength
  var largest
  var size
  var cell
  var lines
  var line
  var before
  var after
  var code

  // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
  // do superfluous work when aligning, so optimize for aligning.
  while (++rowIndex < rowLength) {
    cells = table[rowIndex]
    columnIndex = -1
    columnLength = cells.length
    row = []
    sizes = []

    if (columnLength > mostCellsPerRow) {
      mostCellsPerRow = columnLength
    }

    while (++columnIndex < columnLength) {
      cell = serialize(cells[columnIndex])

      if (alignDelimiters === true) {
        size = stringLength(cell)
        sizes[columnIndex] = size

        largest = longestCellByColumn[columnIndex]

        if (largest === undefined || size > largest) {
          longestCellByColumn[columnIndex] = size
        }
      }

      row.push(cell)
    }

    cellMatrix[rowIndex] = row
    sizeMatrix[rowIndex] = sizes
  }

  // Figure out which alignments to use.
  columnIndex = -1
  columnLength = mostCellsPerRow

  if (typeof align === 'object' && 'length' in align) {
    while (++columnIndex < columnLength) {
      alignments[columnIndex] = toAlignment(align[columnIndex])
    }
  } else {
    code = toAlignment(align)

    while (++columnIndex < columnLength) {
      alignments[columnIndex] = code
    }
  }

  // Inject the alignment row.
  columnIndex = -1
  columnLength = mostCellsPerRow
  row = []
  sizes = []

  while (++columnIndex < columnLength) {
    code = alignments[columnIndex]
    before = ''
    after = ''

    if (code === l) {
      before = colon
    } else if (code === r) {
      after = colon
    } else if (code === c) {
      before = colon
      after = colon
    }

    // There *must* be at least one hyphen-minus in each alignment cell.
    size = alignDelimiters
      ? Math.max(
          1,
          longestCellByColumn[columnIndex] - before.length - after.length
        )
      : 1

    cell = before + repeat(dash, size) + after

    if (alignDelimiters === true) {
      size = before.length + size + after.length

      if (size > longestCellByColumn[columnIndex]) {
        longestCellByColumn[columnIndex] = size
      }

      sizes[columnIndex] = size
    }

    row[columnIndex] = cell
  }

  // Inject the alignment row.
  cellMatrix.splice(1, 0, row)
  sizeMatrix.splice(1, 0, sizes)

  rowIndex = -1
  rowLength = cellMatrix.length
  lines = []

  while (++rowIndex < rowLength) {
    row = cellMatrix[rowIndex]
    sizes = sizeMatrix[rowIndex]
    columnIndex = -1
    columnLength = mostCellsPerRow
    line = []

    while (++columnIndex < columnLength) {
      cell = row[columnIndex] || ''
      before = ''
      after = ''

      if (alignDelimiters === true) {
        size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0)
        code = alignments[columnIndex]

        if (code === r) {
          before = repeat(space, size)
        } else if (code === c) {
          if (size % 2 === 0) {
            before = repeat(space, size / 2)
            after = before
          } else {
            before = repeat(space, size / 2 + 0.5)
            after = repeat(space, size / 2 - 0.5)
          }
        } else {
          after = repeat(space, size)
        }
      }

      if (start === true && columnIndex === 0) {
        line.push(verticalBar)
      }

      if (
        padding === true &&
        // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(alignDelimiters === false && cell === '') &&
        (start === true || columnIndex !== 0)
      ) {
        line.push(space)
      }

      if (alignDelimiters === true) {
        line.push(before)
      }

      line.push(cell)

      if (alignDelimiters === true) {
        line.push(after)
      }

      if (padding === true) {
        line.push(space)
      }

      if (end === true || columnIndex !== columnLength - 1) {
        line.push(verticalBar)
      }
    }

    line = line.join('')

    if (end === false) {
      line = line.replace(trailingWhitespace, '')
    }

    lines.push(line)
  }

  return lines.join(lineFeed)
}

function serialize(value) {
  return value === null || value === undefined ? '' : String(value)
}

function defaultStringLength(value) {
  return value.length
}

function toAlignment(value) {
  var code = typeof value === 'string' ? value.charCodeAt(0) : x

  return code === L || code === l
    ? l
    : code === R || code === r
    ? r
    : code === C || code === c
    ? c
    : x
}


/***/ }),

/***/ 679:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(199)

module.exports = compact

// Make an mdast tree compact by merging adjacent text nodes.
function compact(tree, commonmark) {
  visit(tree, visitor)

  return tree

  function visitor(child, index, parent) {
    var siblings = parent ? parent.children : []
    var prev = index && siblings[index - 1]

    if (
      prev &&
      child.type === prev.type &&
      mergeable(prev, commonmark) &&
      mergeable(child, commonmark)
    ) {
      if (child.value) {
        prev.value += child.value
      }

      if (child.children) {
        prev.children = prev.children.concat(child.children)
      }

      siblings.splice(index, 1)

      if (prev.position && child.position) {
        prev.position.end = child.position.end
      }

      return index
    }
  }
}

function mergeable(node, commonmark) {
  var start
  var end

  if (node.type === 'text') {
    if (!node.position) {
      return true
    }

    start = node.position.start
    end = node.position.end

    // Only merge nodes which occupy the same size as their `value`.
    return (
      start.line !== end.line || end.column - start.column === node.value.length
    )
  }

  return commonmark && node.type === 'blockquote'
}


/***/ }),

/***/ 3485:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var characterEntities = __nccwpck_require__(2661)

module.exports = decodeEntity

var own = {}.hasOwnProperty

function decodeEntity(characters) {
  return own.call(characterEntities, characters)
    ? characterEntities[characters]
    : false
}


/***/ }),

/***/ 8859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var legacy = __nccwpck_require__(7452)
var invalid = __nccwpck_require__(3580)
var decimal = __nccwpck_require__(5552)
var hexadecimal = __nccwpck_require__(7474)
var alphanumerical = __nccwpck_require__(8189)
var decodeEntity = __nccwpck_require__(3485)

module.exports = parseEntities

var own = {}.hasOwnProperty
var fromCharCode = String.fromCharCode
var noop = Function.prototype

// Default settings.
var defaults = {
  warning: null,
  reference: null,
  text: null,
  warningContext: null,
  referenceContext: null,
  textContext: null,
  position: {},
  additional: null,
  attribute: false,
  nonTerminated: true
}

// Characters.
var tab = 9 // '\t'
var lineFeed = 10 // '\n'
var formFeed = 12 // '\f'
var space = 32 // ' '
var ampersand = 38 // '&'
var semicolon = 59 // ';'
var lessThan = 60 // '<'
var equalsTo = 61 // '='
var numberSign = 35 // '#'
var uppercaseX = 88 // 'X'
var lowercaseX = 120 // 'x'
var replacementCharacter = 65533 // '�'

// Reference types.
var name = 'named'
var hexa = 'hexadecimal'
var deci = 'decimal'

// Map of bases.
var bases = {}

bases[hexa] = 16
bases[deci] = 10

// Map of types to tests.
// Each type of character reference accepts different characters.
// This test is used to detect whether a reference has ended (as the semicolon
// is not strictly needed).
var tests = {}

tests[name] = alphanumerical
tests[deci] = decimal
tests[hexa] = hexadecimal

// Warning types.
var namedNotTerminated = 1
var numericNotTerminated = 2
var namedEmpty = 3
var numericEmpty = 4
var namedUnknown = 5
var numericDisallowed = 6
var numericProhibited = 7

// Warning messages.
var messages = {}

messages[namedNotTerminated] =
  'Named character references must be terminated by a semicolon'
messages[numericNotTerminated] =
  'Numeric character references must be terminated by a semicolon'
messages[namedEmpty] = 'Named character references cannot be empty'
messages[numericEmpty] = 'Numeric character references cannot be empty'
messages[namedUnknown] = 'Named character references must be known'
messages[numericDisallowed] =
  'Numeric character references cannot be disallowed'
messages[numericProhibited] =
  'Numeric character references cannot be outside the permissible Unicode range'

// Wrap to ensure clean parameters are given to `parse`.
function parseEntities(value, options) {
  var settings = {}
  var option
  var key

  if (!options) {
    options = {}
  }

  for (key in defaults) {
    option = options[key]
    settings[key] =
      option === null || option === undefined ? defaults[key] : option
  }

  if (settings.position.indent || settings.position.start) {
    settings.indent = settings.position.indent || []
    settings.position = settings.position.start
  }

  return parse(value, settings)
}

// Parse entities.
// eslint-disable-next-line complexity
function parse(value, settings) {
  var additional = settings.additional
  var nonTerminated = settings.nonTerminated
  var handleText = settings.text
  var handleReference = settings.reference
  var handleWarning = settings.warning
  var textContext = settings.textContext
  var referenceContext = settings.referenceContext
  var warningContext = settings.warningContext
  var pos = settings.position
  var indent = settings.indent || []
  var length = value.length
  var index = 0
  var lines = -1
  var column = pos.column || 1
  var line = pos.line || 1
  var queue = ''
  var result = []
  var entityCharacters
  var namedEntity
  var terminated
  var characters
  var character
  var reference
  var following
  var warning
  var reason
  var output
  var entity
  var begin
  var start
  var type
  var test
  var prev
  var next
  var diff
  var end

  if (typeof additional === 'string') {
    additional = additional.charCodeAt(0)
  }

  // Cache the current point.
  prev = now()

  // Wrap `handleWarning`.
  warning = handleWarning ? parseError : noop

  // Ensure the algorithm walks over the first character and the end
  // (inclusive).
  index--
  length++

  while (++index < length) {
    // If the previous character was a newline.
    if (character === lineFeed) {
      column = indent[lines] || 1
    }

    character = value.charCodeAt(index)

    if (character === ampersand) {
      following = value.charCodeAt(index + 1)

      // The behaviour depends on the identity of the next character.
      if (
        following === tab ||
        following === lineFeed ||
        following === formFeed ||
        following === space ||
        following === ampersand ||
        following === lessThan ||
        following !== following ||
        (additional && following === additional)
      ) {
        // Not a character reference.
        // No characters are consumed, and nothing is returned.
        // This is not an error, either.
        queue += fromCharCode(character)
        column++

        continue
      }

      start = index + 1
      begin = start
      end = start

      if (following === numberSign) {
        // Numerical entity.
        end = ++begin

        // The behaviour further depends on the next character.
        following = value.charCodeAt(end)

        if (following === uppercaseX || following === lowercaseX) {
          // ASCII hex digits.
          type = hexa
          end = ++begin
        } else {
          // ASCII digits.
          type = deci
        }
      } else {
        // Named entity.
        type = name
      }

      entityCharacters = ''
      entity = ''
      characters = ''
      test = tests[type]
      end--

      while (++end < length) {
        following = value.charCodeAt(end)

        if (!test(following)) {
          break
        }

        characters += fromCharCode(following)

        // Check if we can match a legacy named reference.
        // If so, we cache that as the last viable named reference.
        // This ensures we do not need to walk backwards later.
        if (type === name && own.call(legacy, characters)) {
          entityCharacters = characters
          entity = legacy[characters]
        }
      }

      terminated = value.charCodeAt(end) === semicolon

      if (terminated) {
        end++

        namedEntity = type === name ? decodeEntity(characters) : false

        if (namedEntity) {
          entityCharacters = characters
          entity = namedEntity
        }
      }

      diff = 1 + end - start

      if (!terminated && !nonTerminated) {
        // Empty.
      } else if (!characters) {
        // An empty (possible) entity is valid, unless it’s numeric (thus an
        // ampersand followed by an octothorp).
        if (type !== name) {
          warning(numericEmpty, diff)
        }
      } else if (type === name) {
        // An ampersand followed by anything unknown, and not terminated, is
        // invalid.
        if (terminated && !entity) {
          warning(namedUnknown, 1)
        } else {
          // If theres something after an entity name which is not known, cap
          // the reference.
          if (entityCharacters !== characters) {
            end = begin + entityCharacters.length
            diff = 1 + end - begin
            terminated = false
          }

          // If the reference is not terminated, warn.
          if (!terminated) {
            reason = entityCharacters ? namedNotTerminated : namedEmpty

            if (settings.attribute) {
              following = value.charCodeAt(end)

              if (following === equalsTo) {
                warning(reason, diff)
                entity = null
              } else if (alphanumerical(following)) {
                entity = null
              } else {
                warning(reason, diff)
              }
            } else {
              warning(reason, diff)
            }
          }
        }

        reference = entity
      } else {
        if (!terminated) {
          // All non-terminated numeric entities are not rendered, and trigger a
          // warning.
          warning(numericNotTerminated, diff)
        }

        // When terminated and number, parse as either hexadecimal or decimal.
        reference = parseInt(characters, bases[type])

        // Trigger a warning when the parsed number is prohibited, and replace
        // with replacement character.
        if (prohibited(reference)) {
          warning(numericProhibited, diff)
          reference = fromCharCode(replacementCharacter)
        } else if (reference in invalid) {
          // Trigger a warning when the parsed number is disallowed, and replace
          // by an alternative.
          warning(numericDisallowed, diff)
          reference = invalid[reference]
        } else {
          // Parse the number.
          output = ''

          // Trigger a warning when the parsed number should not be used.
          if (disallowed(reference)) {
            warning(numericDisallowed, diff)
          }

          // Stringify the number.
          if (reference > 0xffff) {
            reference -= 0x10000
            output += fromCharCode((reference >>> (10 & 0x3ff)) | 0xd800)
            reference = 0xdc00 | (reference & 0x3ff)
          }

          reference = output + fromCharCode(reference)
        }
      }

      // Found it!
      // First eat the queued characters as normal text, then eat an entity.
      if (reference) {
        flush()

        prev = now()
        index = end - 1
        column += end - start + 1
        result.push(reference)
        next = now()
        next.offset++

        if (handleReference) {
          handleReference.call(
            referenceContext,
            reference,
            {start: prev, end: next},
            value.slice(start - 1, end)
          )
        }

        prev = next
      } else {
        // If we could not find a reference, queue the checked characters (as
        // normal characters), and move the pointer to their end.
        // This is possible because we can be certain neither newlines nor
        // ampersands are included.
        characters = value.slice(start - 1, end)
        queue += characters
        column += characters.length
        index = end - 1
      }
    } else {
      // Handle anything other than an ampersand, including newlines and EOF.
      if (
        character === 10 // Line feed
      ) {
        line++
        lines++
        column = 0
      }

      if (character === character) {
        queue += fromCharCode(character)
        column++
      } else {
        flush()
      }
    }
  }

  // Return the reduced nodes.
  return result.join('')

  // Get current position.
  function now() {
    return {
      line: line,
      column: column,
      offset: index + (pos.offset || 0)
    }
  }

  // “Throw” a parse-error: a warning.
  function parseError(code, offset) {
    var position = now()

    position.column += offset
    position.offset += offset

    handleWarning.call(warningContext, messages[code], position, code)
  }

  // Flush `queue` (normal text).
  // Macro invoked before each entity and at the end of `value`.
  // Does nothing when `queue` is empty.
  function flush() {
    if (queue) {
      result.push(queue)

      if (handleText) {
        handleText.call(textContext, queue, {start: prev, end: now()})
      }

      queue = ''
    }
  }
}

// Check if `character` is outside the permissible unicode range.
function prohibited(code) {
  return (code >= 0xd800 && code <= 0xdfff) || code > 0x10ffff
}

// Check if `character` is disallowed.
function disallowed(code) {
  return (
    (code >= 0x0001 && code <= 0x0008) ||
    code === 0x000b ||
    (code >= 0x000d && code <= 0x001f) ||
    (code >= 0x007f && code <= 0x009f) ||
    (code >= 0xfdd0 && code <= 0xfdef) ||
    (code & 0xffff) === 0xffff ||
    (code & 0xffff) === 0xfffe
  )
}


/***/ }),

/***/ 4859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unherit = __nccwpck_require__(6623)
var xtend = __nccwpck_require__(1208)
var Parser = __nccwpck_require__(2683)

module.exports = parse
parse.Parser = Parser

function parse(options) {
  var settings = this.data('settings')
  var Local = unherit(Parser)

  Local.prototype.options = xtend(Local.prototype.options, settings, options)

  this.Parser = Local
}


/***/ }),

/***/ 7311:
/***/ ((module) => {

"use strict";


module.exports = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'meta',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'pre',
  'section',
  'source',
  'title',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
]


/***/ }),

/***/ 3811:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var entities = __nccwpck_require__(8859)

module.exports = factory

// Factory to create an entity decoder.
function factory(ctx) {
  decoder.raw = decodeRaw

  return decoder

  // Normalize `position` to add an `indent`.
  function normalize(position) {
    var offsets = ctx.offset
    var line = position.line
    var result = []

    while (++line) {
      if (!(line in offsets)) {
        break
      }

      result.push((offsets[line] || 0) + 1)
    }

    return {start: position, indent: result}
  }

  // Decode `value` (at `position`) into text-nodes.
  function decoder(value, position, handler) {
    entities(value, {
      position: normalize(position),
      warning: handleWarning,
      text: handler,
      reference: handler,
      textContext: ctx,
      referenceContext: ctx
    })
  }

  // Decode `value` (at `position`) into a string.
  function decodeRaw(value, position, options) {
    return entities(
      value,
      xtend(options, {position: normalize(position), warning: handleWarning})
    )
  }

  // Handle a warning.
  // See <https://github.com/wooorm/parse-entities> for the warnings.
  function handleWarning(reason, position, code) {
    if (code !== 3) {
      ctx.file.message(reason, position)
    }
  }
}


/***/ }),

/***/ 2557:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  position: true,
  gfm: true,
  commonmark: false,
  pedantic: false,
  blocks: __nccwpck_require__(7311)
}


/***/ }),

/***/ 6603:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  var index = value.indexOf('\n', fromIndex)

  while (index > fromIndex) {
    if (value.charAt(index - 1) !== ' ') {
      break
    }

    index--
  }

  return index
}


/***/ }),

/***/ 4222:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  return value.indexOf('`', fromIndex)
}


/***/ }),

/***/ 8419:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  return value.indexOf('~~', fromIndex)
}


/***/ }),

/***/ 7466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var decimal = __nccwpck_require__(5552)
var alphabetical = __nccwpck_require__(1997)

var plusSign = 43 // '+'
var dash = 45 // '-'
var dot = 46 // '.'
var underscore = 95 // '_'

module.exports = locate

// See: <https://github.github.com/gfm/#extended-email-autolink>
function locate(value, fromIndex) {
  var self = this
  var at
  var position

  if (!this.options.gfm) {
    return -1
  }

  at = value.indexOf('@', fromIndex)

  if (at === -1) {
    return -1
  }

  position = at

  if (position === fromIndex || !isGfmAtext(value.charCodeAt(position - 1))) {
    return locate.call(self, value, at + 1)
  }

  while (position > fromIndex && isGfmAtext(value.charCodeAt(position - 1))) {
    position--
  }

  return position
}

function isGfmAtext(code) {
  return (
    decimal(code) ||
    alphabetical(code) ||
    code === plusSign ||
    code === dash ||
    code === dot ||
    code === underscore
  )
}


/***/ }),

/***/ 366:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  var asterisk = value.indexOf('*', fromIndex)
  var underscore = value.indexOf('_', fromIndex)

  if (underscore === -1) {
    return asterisk
  }

  if (asterisk === -1) {
    return underscore
  }

  return underscore < asterisk ? underscore : asterisk
}


/***/ }),

/***/ 6230:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  return value.indexOf('\\', fromIndex)
}


/***/ }),

/***/ 2532:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  var link = value.indexOf('[', fromIndex)
  var image = value.indexOf('![', fromIndex)

  if (image === -1) {
    return link
  }

  // Link can never be `-1` if an image is found, so we don’t need to check
  // for that :)
  return link < image ? link : image
}


/***/ }),

/***/ 5514:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  var asterisk = value.indexOf('**', fromIndex)
  var underscore = value.indexOf('__', fromIndex)

  if (underscore === -1) {
    return asterisk
  }

  if (asterisk === -1) {
    return underscore
  }

  return underscore < asterisk ? underscore : asterisk
}


/***/ }),

/***/ 6330:
/***/ ((module) => {

"use strict";


module.exports = locate

function locate(value, fromIndex) {
  return value.indexOf('<', fromIndex)
}


/***/ }),

/***/ 327:
/***/ ((module) => {

"use strict";


module.exports = locate

var values = ['www.', 'http://', 'https://']

function locate(value, fromIndex) {
  var min = -1
  var index
  var length
  var position

  if (!this.options.gfm) {
    return min
  }

  length = values.length
  index = -1

  while (++index < length) {
    position = value.indexOf(values[index], fromIndex)

    if (position !== -1 && (min === -1 || position < min)) {
      min = position
    }
  }

  return min
}


/***/ }),

/***/ 7329:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var removePosition = __nccwpck_require__(7970)

module.exports = parse

var lineFeed = '\n'
var lineBreaksExpression = /\r\n|\r/g

// Parse the bound file.
function parse() {
  var self = this
  var value = String(self.file)
  var start = {line: 1, column: 1, offset: 0}
  var content = xtend(start)
  var node

  // Clean non-unix newlines: `\r\n` and `\r` are all changed to `\n`.
  // This should not affect positional information.
  value = value.replace(lineBreaksExpression, lineFeed)

  // BOM.
  if (value.charCodeAt(0) === 0xfeff) {
    value = value.slice(1)

    content.column++
    content.offset++
  }

  node = {
    type: 'root',
    children: self.tokenizeBlock(value, content),
    position: {start: start, end: self.eof || xtend(start)}
  }

  if (!self.options.position) {
    removePosition(node, true)
  }

  return node
}


/***/ }),

/***/ 2683:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var toggle = __nccwpck_require__(6435)
var vfileLocation = __nccwpck_require__(2403)
var unescape = __nccwpck_require__(4063)
var decode = __nccwpck_require__(3811)
var tokenizer = __nccwpck_require__(8970)

module.exports = Parser

function Parser(doc, file) {
  this.file = file
  this.offset = {}
  this.options = xtend(this.options)
  this.setOptions({})

  this.inList = false
  this.inBlock = false
  this.inLink = false
  this.atStart = true

  this.toOffset = vfileLocation(file).toOffset
  this.unescape = unescape(this, 'escape')
  this.decode = decode(this)
}

var proto = Parser.prototype

// Expose core.
proto.setOptions = __nccwpck_require__(9449)
proto.parse = __nccwpck_require__(7329)

// Expose `defaults`.
proto.options = __nccwpck_require__(2557)

// Enter and exit helpers.
proto.exitStart = toggle('atStart', true)
proto.enterList = toggle('inList', false)
proto.enterLink = toggle('inLink', false)
proto.enterBlock = toggle('inBlock', false)

// Nodes that can interupt a paragraph:
//
// ```markdown
// A paragraph, followed by a thematic break.
// ___
// ```
//
// In the above example, the thematic break “interupts” the paragraph.
proto.interruptParagraph = [
  ['thematicBreak'],
  ['list'],
  ['atxHeading'],
  ['fencedCode'],
  ['blockquote'],
  ['html'],
  ['setextHeading', {commonmark: false}],
  ['definition', {commonmark: false}]
]

// Nodes that can interupt a list:
//
// ```markdown
// - One
// ___
// ```
//
// In the above example, the thematic break “interupts” the list.
proto.interruptList = [
  ['atxHeading', {pedantic: false}],
  ['fencedCode', {pedantic: false}],
  ['thematicBreak', {pedantic: false}],
  ['definition', {commonmark: false}]
]

// Nodes that can interupt a blockquote:
//
// ```markdown
// > A paragraph.
// ___
// ```
//
// In the above example, the thematic break “interupts” the blockquote.
proto.interruptBlockquote = [
  ['indentedCode', {commonmark: true}],
  ['fencedCode', {commonmark: true}],
  ['atxHeading', {commonmark: true}],
  ['setextHeading', {commonmark: true}],
  ['thematicBreak', {commonmark: true}],
  ['html', {commonmark: true}],
  ['list', {commonmark: true}],
  ['definition', {commonmark: false}]
]

// Handlers.
proto.blockTokenizers = {
  blankLine: __nccwpck_require__(3093),
  indentedCode: __nccwpck_require__(5813),
  fencedCode: __nccwpck_require__(1553),
  blockquote: __nccwpck_require__(2614),
  atxHeading: __nccwpck_require__(5544),
  thematicBreak: __nccwpck_require__(2763),
  list: __nccwpck_require__(3766),
  setextHeading: __nccwpck_require__(7263),
  html: __nccwpck_require__(8514),
  definition: __nccwpck_require__(7387),
  table: __nccwpck_require__(3274),
  paragraph: __nccwpck_require__(2082)
}

proto.inlineTokenizers = {
  escape: __nccwpck_require__(950),
  autoLink: __nccwpck_require__(3763),
  url: __nccwpck_require__(5069),
  email: __nccwpck_require__(7397),
  html: __nccwpck_require__(9155),
  link: __nccwpck_require__(8337),
  reference: __nccwpck_require__(3699),
  strong: __nccwpck_require__(9569),
  emphasis: __nccwpck_require__(4133),
  deletion: __nccwpck_require__(5052),
  code: __nccwpck_require__(7215),
  break: __nccwpck_require__(2822),
  text: __nccwpck_require__(9916)
}

// Expose precedence.
proto.blockMethods = keys(proto.blockTokenizers)
proto.inlineMethods = keys(proto.inlineTokenizers)

// Tokenizers.
proto.tokenizeBlock = tokenizer('block')
proto.tokenizeInline = tokenizer('inline')
proto.tokenizeFactory = tokenizer

// Get all keys in `value`.
function keys(value) {
  var result = []
  var key

  for (key in value) {
    result.push(key)
  }

  return result
}


/***/ }),

/***/ 9449:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var escapes = __nccwpck_require__(8805)
var defaults = __nccwpck_require__(2557)

module.exports = setOptions

function setOptions(options) {
  var self = this
  var current = self.options
  var key
  var value

  if (options == null) {
    options = {}
  } else if (typeof options === 'object') {
    options = xtend(options)
  } else {
    throw new Error('Invalid value `' + options + '` for setting `options`')
  }

  for (key in defaults) {
    value = options[key]

    if (value == null) {
      value = current[key]
    }

    if (
      (key !== 'blocks' && typeof value !== 'boolean') ||
      (key === 'blocks' && typeof value !== 'object')
    ) {
      throw new Error(
        'Invalid value `' + value + '` for setting `options.' + key + '`'
      )
    }

    options[key] = value
  }

  self.options = options
  self.escape = escapes(options)

  return self
}


/***/ }),

/***/ 3763:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)
var decode = __nccwpck_require__(8859)
var locate = __nccwpck_require__(6330)

module.exports = autoLink
autoLink.locator = locate
autoLink.notInLink = true

var lessThan = '<'
var greaterThan = '>'
var atSign = '@'
var slash = '/'
var mailto = 'mailto:'
var mailtoLength = mailto.length

function autoLink(eat, value, silent) {
  var self = this
  var subvalue = ''
  var length = value.length
  var index = 0
  var queue = ''
  var hasAtCharacter = false
  var link = ''
  var character
  var now
  var content
  var tokenizers
  var exit

  if (value.charAt(0) !== lessThan) {
    return
  }

  index++
  subvalue = lessThan

  while (index < length) {
    character = value.charAt(index)

    if (
      whitespace(character) ||
      character === greaterThan ||
      character === atSign ||
      (character === ':' && value.charAt(index + 1) === slash)
    ) {
      break
    }

    queue += character
    index++
  }

  if (!queue) {
    return
  }

  link += queue
  queue = ''

  character = value.charAt(index)
  link += character
  index++

  if (character === atSign) {
    hasAtCharacter = true
  } else {
    if (character !== ':' || value.charAt(index + 1) !== slash) {
      return
    }

    link += slash
    index++
  }

  while (index < length) {
    character = value.charAt(index)

    if (whitespace(character) || character === greaterThan) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)

  if (!queue || character !== greaterThan) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  link += queue
  content = link
  subvalue += link + character
  now = eat.now()
  now.column++
  now.offset++

  if (hasAtCharacter) {
    if (link.slice(0, mailtoLength).toLowerCase() === mailto) {
      content = content.slice(mailtoLength)
      now.column += mailtoLength
      now.offset += mailtoLength
    } else {
      link = mailto + link
    }
  }

  // Temporarily remove all tokenizers except text in autolinks.
  tokenizers = self.inlineTokenizers
  self.inlineTokenizers = {text: tokenizers.text}

  exit = self.enterLink()

  content = self.tokenizeInline(content, now)

  self.inlineTokenizers = tokenizers
  exit()

  return eat(subvalue)({
    type: 'link',
    title: null,
    url: decode(link, {nonTerminated: false}),
    children: content
  })
}


/***/ }),

/***/ 3093:
/***/ ((module) => {

"use strict";


// A line containing no characters, or a line containing only spaces (U+0020) or
// tabs (U+0009), is called a blank line.
// See <https://spec.commonmark.org/0.29/#blank-line>.
var reBlankLine = /^[ \t]*(\n|$)/

// Note that though blank lines play a special role in lists to determine
// whether the list is tight or loose
// (<https://spec.commonmark.org/0.29/#blank-lines>), it’s done by the list
// tokenizer and this blank line tokenizer does not have to be responsible for
// that.
// Therefore, configs such as `blankLine.notInList` do not have to be set here.
module.exports = blankLine

function blankLine(eat, value, silent) {
  var match
  var subvalue = ''
  var index = 0
  var length = value.length

  while (index < length) {
    match = reBlankLine.exec(value.slice(index))

    if (match == null) {
      break
    }

    index += match[0].length
    subvalue += match[0]
  }

  if (subvalue === '') {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  eat(subvalue)
}


/***/ }),

/***/ 2614:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var interrupt = __nccwpck_require__(1783)

module.exports = blockquote

var lineFeed = '\n'
var tab = '\t'
var space = ' '
var greaterThan = '>'

function blockquote(eat, value, silent) {
  var self = this
  var offsets = self.offset
  var tokenizers = self.blockTokenizers
  var interruptors = self.interruptBlockquote
  var now = eat.now()
  var currentLine = now.line
  var length = value.length
  var values = []
  var contents = []
  var indents = []
  var add
  var index = 0
  var character
  var rest
  var nextIndex
  var content
  var line
  var startIndex
  var prefixed
  var exit

  while (index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      break
    }

    index++
  }

  if (value.charAt(index) !== greaterThan) {
    return
  }

  if (silent) {
    return true
  }

  index = 0

  while (index < length) {
    nextIndex = value.indexOf(lineFeed, index)
    startIndex = index
    prefixed = false

    if (nextIndex === -1) {
      nextIndex = length
    }

    while (index < length) {
      character = value.charAt(index)

      if (character !== space && character !== tab) {
        break
      }

      index++
    }

    if (value.charAt(index) === greaterThan) {
      index++
      prefixed = true

      if (value.charAt(index) === space) {
        index++
      }
    } else {
      index = startIndex
    }

    content = value.slice(index, nextIndex)

    if (!prefixed && !trim(content)) {
      index = startIndex
      break
    }

    if (!prefixed) {
      rest = value.slice(index)

      // Check if the following code contains a possible block.
      if (interrupt(interruptors, tokenizers, self, [eat, rest, true])) {
        break
      }
    }

    line = startIndex === index ? content : value.slice(startIndex, nextIndex)

    indents.push(index - startIndex)
    values.push(line)
    contents.push(content)

    index = nextIndex + 1
  }

  index = -1
  length = indents.length
  add = eat(values.join(lineFeed))

  while (++index < length) {
    offsets[currentLine] = (offsets[currentLine] || 0) + indents[index]
    currentLine++
  }

  exit = self.enterBlock()
  contents = self.tokenizeBlock(contents.join(lineFeed), now)
  exit()

  return add({type: 'blockquote', children: contents})
}


/***/ }),

/***/ 2822:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var locate = __nccwpck_require__(6603)

module.exports = hardBreak
hardBreak.locator = locate

var space = ' '
var lineFeed = '\n'
var minBreakLength = 2

function hardBreak(eat, value, silent) {
  var length = value.length
  var index = -1
  var queue = ''
  var character

  while (++index < length) {
    character = value.charAt(index)

    if (character === lineFeed) {
      if (index < minBreakLength) {
        return
      }

      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      queue += character

      return eat(queue)({type: 'break'})
    }

    if (character !== space) {
      return
    }

    queue += character
  }
}


/***/ }),

/***/ 1553:
/***/ ((module) => {

"use strict";


module.exports = fencedCode

var lineFeed = '\n'
var tab = '\t'
var space = ' '
var tilde = '~'
var graveAccent = '`'

var minFenceCount = 3
var tabSize = 4

function fencedCode(eat, value, silent) {
  var self = this
  var gfm = self.options.gfm
  var length = value.length + 1
  var index = 0
  var subvalue = ''
  var fenceCount
  var marker
  var character
  var flag
  var lang
  var meta
  var queue
  var content
  var exdentedContent
  var closing
  var exdentedClosing
  var indent
  var now

  if (!gfm) {
    return
  }

  // Eat initial spacing.
  while (index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      break
    }

    subvalue += character
    index++
  }

  indent = index

  // Eat the fence.
  character = value.charAt(index)

  if (character !== tilde && character !== graveAccent) {
    return
  }

  index++
  marker = character
  fenceCount = 1
  subvalue += character

  while (index < length) {
    character = value.charAt(index)

    if (character !== marker) {
      break
    }

    subvalue += character
    fenceCount++
    index++
  }

  if (fenceCount < minFenceCount) {
    return
  }

  // Eat spacing before flag.
  while (index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      break
    }

    subvalue += character
    index++
  }

  // Eat flag.
  flag = ''
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (
      character === lineFeed ||
      (marker === graveAccent && character === marker)
    ) {
      break
    }

    if (character === space || character === tab) {
      queue += character
    } else {
      flag += queue + character
      queue = ''
    }

    index++
  }

  character = value.charAt(index)

  if (character && character !== lineFeed) {
    return
  }

  if (silent) {
    return true
  }

  now = eat.now()
  now.column += subvalue.length
  now.offset += subvalue.length

  subvalue += flag
  flag = self.decode.raw(self.unescape(flag), now)

  if (queue) {
    subvalue += queue
  }

  queue = ''
  closing = ''
  exdentedClosing = ''
  content = ''
  exdentedContent = ''
  var skip = true

  // Eat content.
  while (index < length) {
    character = value.charAt(index)
    content += closing
    exdentedContent += exdentedClosing
    closing = ''
    exdentedClosing = ''

    if (character !== lineFeed) {
      content += character
      exdentedClosing += character
      index++
      continue
    }

    // The first line feed is ignored. Others aren’t.
    if (skip) {
      subvalue += character
      skip = false
    } else {
      closing += character
      exdentedClosing += character
    }

    queue = ''
    index++

    while (index < length) {
      character = value.charAt(index)

      if (character !== space) {
        break
      }

      queue += character
      index++
    }

    closing += queue
    exdentedClosing += queue.slice(indent)

    if (queue.length >= tabSize) {
      continue
    }

    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (character !== marker) {
        break
      }

      queue += character
      index++
    }

    closing += queue
    exdentedClosing += queue

    if (queue.length < fenceCount) {
      continue
    }

    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (character !== space && character !== tab) {
        break
      }

      closing += character
      exdentedClosing += character
      index++
    }

    if (!character || character === lineFeed) {
      break
    }
  }

  subvalue += content + closing

  // Get lang and meta from the flag.
  index = -1
  length = flag.length

  while (++index < length) {
    character = flag.charAt(index)

    if (character === space || character === tab) {
      if (!lang) {
        lang = flag.slice(0, index)
      }
    } else if (lang) {
      meta = flag.slice(index)
      break
    }
  }

  return eat(subvalue)({
    type: 'code',
    lang: lang || flag || null,
    meta: meta || null,
    value: exdentedContent
  })
}


/***/ }),

/***/ 5813:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)
var trim = __nccwpck_require__(3199)

module.exports = indentedCode

var lineFeed = '\n'
var tab = '\t'
var space = ' '

var tabSize = 4
var codeIndent = repeat(space, tabSize)

function indentedCode(eat, value, silent) {
  var index = -1
  var length = value.length
  var subvalue = ''
  var content = ''
  var subvalueQueue = ''
  var contentQueue = ''
  var character
  var blankQueue
  var indent

  while (++index < length) {
    character = value.charAt(index)

    if (indent) {
      indent = false

      subvalue += subvalueQueue
      content += contentQueue
      subvalueQueue = ''
      contentQueue = ''

      if (character === lineFeed) {
        subvalueQueue = character
        contentQueue = character
      } else {
        subvalue += character
        content += character

        while (++index < length) {
          character = value.charAt(index)

          if (!character || character === lineFeed) {
            contentQueue = character
            subvalueQueue = character
            break
          }

          subvalue += character
          content += character
        }
      }
    } else if (
      character === space &&
      value.charAt(index + 1) === character &&
      value.charAt(index + 2) === character &&
      value.charAt(index + 3) === character
    ) {
      subvalueQueue += codeIndent
      index += 3
      indent = true
    } else if (character === tab) {
      subvalueQueue += character
      indent = true
    } else {
      blankQueue = ''

      while (character === tab || character === space) {
        blankQueue += character
        character = value.charAt(++index)
      }

      if (character !== lineFeed) {
        break
      }

      subvalueQueue += blankQueue + character
      contentQueue += character
    }
  }

  if (content) {
    if (silent) {
      return true
    }

    return eat(subvalue)({
      type: 'code',
      lang: null,
      meta: null,
      value: trim(content)
    })
  }
}


/***/ }),

/***/ 7215:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var locate = __nccwpck_require__(4222)

module.exports = inlineCode
inlineCode.locator = locate

var lineFeed = 10 //  '\n'
var space = 32 // ' '
var graveAccent = 96 //  '`'

function inlineCode(eat, value, silent) {
  var length = value.length
  var index = 0
  var openingFenceEnd
  var closingFenceStart
  var closingFenceEnd
  var code
  var next
  var found

  while (index < length) {
    if (value.charCodeAt(index) !== graveAccent) {
      break
    }

    index++
  }

  if (index === 0 || index === length) {
    return
  }

  openingFenceEnd = index
  next = value.charCodeAt(index)

  while (index < length) {
    code = next
    next = value.charCodeAt(index + 1)

    if (code === graveAccent) {
      if (closingFenceStart === undefined) {
        closingFenceStart = index
      }

      closingFenceEnd = index + 1

      if (
        next !== graveAccent &&
        closingFenceEnd - closingFenceStart === openingFenceEnd
      ) {
        found = true
        break
      }
    } else if (closingFenceStart !== undefined) {
      closingFenceStart = undefined
      closingFenceEnd = undefined
    }

    index++
  }

  if (!found) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  // Remove the initial and final space (or line feed), iff they exist and there
  // are non-space characters in the content.
  index = openingFenceEnd
  length = closingFenceStart
  code = value.charCodeAt(index)
  next = value.charCodeAt(length - 1)
  found = false

  if (
    length - index > 2 &&
    (code === space || code === lineFeed) &&
    (next === space || next === lineFeed)
  ) {
    index++
    length--

    while (index < length) {
      code = value.charCodeAt(index)

      if (code !== space && code !== lineFeed) {
        found = true
        break
      }

      index++
    }

    if (found === true) {
      openingFenceEnd++
      closingFenceStart--
    }
  }

  return eat(value.slice(0, closingFenceEnd))({
    type: 'inlineCode',
    value: value.slice(openingFenceEnd, closingFenceStart)
  })
}


/***/ }),

/***/ 7387:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)
var normalize = __nccwpck_require__(2482)

module.exports = definition

var quotationMark = '"'
var apostrophe = "'"
var backslash = '\\'
var lineFeed = '\n'
var tab = '\t'
var space = ' '
var leftSquareBracket = '['
var rightSquareBracket = ']'
var leftParenthesis = '('
var rightParenthesis = ')'
var colon = ':'
var lessThan = '<'
var greaterThan = '>'

function definition(eat, value, silent) {
  var self = this
  var commonmark = self.options.commonmark
  var index = 0
  var length = value.length
  var subvalue = ''
  var beforeURL
  var beforeTitle
  var queue
  var character
  var test
  var identifier
  var url
  var title

  while (index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)

  if (character !== leftSquareBracket) {
    return
  }

  index++
  subvalue += character
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character === rightSquareBracket) {
      break
    } else if (character === backslash) {
      queue += character
      index++
      character = value.charAt(index)
    }

    queue += character
    index++
  }

  if (
    !queue ||
    value.charAt(index) !== rightSquareBracket ||
    value.charAt(index + 1) !== colon
  ) {
    return
  }

  identifier = queue
  subvalue += queue + rightSquareBracket + colon
  index = subvalue.length
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space && character !== lineFeed) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)
  queue = ''
  beforeURL = subvalue

  if (character === lessThan) {
    index++

    while (index < length) {
      character = value.charAt(index)

      if (!isEnclosedURLCharacter(character)) {
        break
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (character === isEnclosedURLCharacter.delimiter) {
      subvalue += lessThan + queue + character
      index++
    } else {
      if (commonmark) {
        return
      }

      index -= queue.length + 1
      queue = ''
    }
  }

  if (!queue) {
    while (index < length) {
      character = value.charAt(index)

      if (!isUnclosedURLCharacter(character)) {
        break
      }

      queue += character
      index++
    }

    subvalue += queue
  }

  if (!queue) {
    return
  }

  url = queue
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space && character !== lineFeed) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)
  test = null

  if (character === quotationMark) {
    test = quotationMark
  } else if (character === apostrophe) {
    test = apostrophe
  } else if (character === leftParenthesis) {
    test = rightParenthesis
  }

  if (!test) {
    queue = ''
    index = subvalue.length
  } else if (queue) {
    subvalue += queue + character
    index = subvalue.length
    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (character === test) {
        break
      }

      if (character === lineFeed) {
        index++
        character = value.charAt(index)

        if (character === lineFeed || character === test) {
          return
        }

        queue += lineFeed
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (character !== test) {
      return
    }

    beforeTitle = subvalue
    subvalue += queue + character
    index++
    title = queue
    queue = ''
  } else {
    return
  }

  while (index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)

  if (!character || character === lineFeed) {
    if (silent) {
      return true
    }

    beforeURL = eat(beforeURL).test().end
    url = self.decode.raw(self.unescape(url), beforeURL, {nonTerminated: false})

    if (title) {
      beforeTitle = eat(beforeTitle).test().end
      title = self.decode.raw(self.unescape(title), beforeTitle)
    }

    return eat(subvalue)({
      type: 'definition',
      identifier: normalize(identifier),
      label: identifier,
      title: title || null,
      url: url
    })
  }
}

// Check if `character` can be inside an enclosed URI.
function isEnclosedURLCharacter(character) {
  return (
    character !== greaterThan &&
    character !== leftSquareBracket &&
    character !== rightSquareBracket
  )
}

isEnclosedURLCharacter.delimiter = greaterThan

// Check if `character` can be inside an unclosed URI.
function isUnclosedURLCharacter(character) {
  return (
    character !== leftSquareBracket &&
    character !== rightSquareBracket &&
    !whitespace(character)
  )
}


/***/ }),

/***/ 5052:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(8419)

module.exports = strikethrough
strikethrough.locator = locate

var tilde = '~'
var fence = '~~'

function strikethrough(eat, value, silent) {
  var self = this
  var character = ''
  var previous = ''
  var preceding = ''
  var subvalue = ''
  var index
  var length
  var now

  if (
    !self.options.gfm ||
    value.charAt(0) !== tilde ||
    value.charAt(1) !== tilde ||
    whitespace(value.charAt(2))
  ) {
    return
  }

  index = 1
  length = value.length
  now = eat.now()
  now.column += 2
  now.offset += 2

  while (++index < length) {
    character = value.charAt(index)

    if (
      character === tilde &&
      previous === tilde &&
      (!preceding || !whitespace(preceding))
    ) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      return eat(fence + subvalue + fence)({
        type: 'delete',
        children: self.tokenizeInline(subvalue, now)
      })
    }

    subvalue += previous
    preceding = previous
    previous = character
  }
}


/***/ }),

/***/ 7397:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var decode = __nccwpck_require__(8859)
var decimal = __nccwpck_require__(5552)
var alphabetical = __nccwpck_require__(1997)
var locate = __nccwpck_require__(7466)

module.exports = email
email.locator = locate
email.notInLink = true

var plusSign = 43 // '+'
var dash = 45 // '-'
var dot = 46 // '.'
var atSign = 64 // '@'
var underscore = 95 // '_'

function email(eat, value, silent) {
  var self = this
  var gfm = self.options.gfm
  var tokenizers = self.inlineTokenizers
  var index = 0
  var length = value.length
  var firstDot = -1
  var code
  var content
  var children
  var exit

  if (!gfm) {
    return
  }

  code = value.charCodeAt(index)

  while (
    decimal(code) ||
    alphabetical(code) ||
    code === plusSign ||
    code === dash ||
    code === dot ||
    code === underscore
  ) {
    code = value.charCodeAt(++index)
  }

  if (index === 0) {
    return
  }

  if (code !== atSign) {
    return
  }

  index++

  while (index < length) {
    code = value.charCodeAt(index)

    if (
      decimal(code) ||
      alphabetical(code) ||
      code === dash ||
      code === dot ||
      code === underscore
    ) {
      index++

      if (firstDot === -1 && code === dot) {
        firstDot = index
      }

      continue
    }

    break
  }

  if (
    firstDot === -1 ||
    firstDot === index ||
    code === dash ||
    code === underscore
  ) {
    return
  }

  if (code === dot) {
    index--
  }

  content = value.slice(0, index)

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  exit = self.enterLink()

  // Temporarily remove all tokenizers except text in url.
  self.inlineTokenizers = {text: tokenizers.text}
  children = self.tokenizeInline(content, eat.now())
  self.inlineTokenizers = tokenizers

  exit()

  return eat(content)({
    type: 'link',
    title: null,
    url: 'mailto:' + decode(content, {nonTerminated: false}),
    children: children
  })
}


/***/ }),

/***/ 4133:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var word = __nccwpck_require__(1623)
var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(366)

module.exports = emphasis
emphasis.locator = locate

var asterisk = '*'
var underscore = '_'
var backslash = '\\'

function emphasis(eat, value, silent) {
  var self = this
  var index = 0
  var character = value.charAt(index)
  var now
  var pedantic
  var marker
  var queue
  var subvalue
  var length
  var previous

  if (character !== asterisk && character !== underscore) {
    return
  }

  pedantic = self.options.pedantic
  subvalue = character
  marker = character
  length = value.length
  index++
  queue = ''
  character = ''

  if (pedantic && whitespace(value.charAt(index))) {
    return
  }

  while (index < length) {
    previous = character
    character = value.charAt(index)

    if (character === marker && (!pedantic || !whitespace(previous))) {
      character = value.charAt(++index)

      if (character !== marker) {
        if (!trim(queue) || previous === marker) {
          return
        }

        if (!pedantic && marker === underscore && word(character)) {
          queue += marker
          continue
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        now = eat.now()
        now.column++
        now.offset++

        return eat(subvalue + queue + marker)({
          type: 'emphasis',
          children: self.tokenizeInline(queue, now)
        })
      }

      queue += marker
    }

    if (!pedantic && character === backslash) {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
}


/***/ }),

/***/ 950:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var locate = __nccwpck_require__(6230)

module.exports = escape
escape.locator = locate

var lineFeed = '\n'
var backslash = '\\'

function escape(eat, value, silent) {
  var self = this
  var character
  var node

  if (value.charAt(0) === backslash) {
    character = value.charAt(1)

    if (self.escape.indexOf(character) !== -1) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      if (character === lineFeed) {
        node = {type: 'break'}
      } else {
        node = {type: 'text', value: character}
      }

      return eat(backslash + character)(node)
    }
  }
}


/***/ }),

/***/ 5544:
/***/ ((module) => {

"use strict";


module.exports = atxHeading

var lineFeed = '\n'
var tab = '\t'
var space = ' '
var numberSign = '#'

var maxFenceCount = 6

function atxHeading(eat, value, silent) {
  var self = this
  var pedantic = self.options.pedantic
  var length = value.length + 1
  var index = -1
  var now = eat.now()
  var subvalue = ''
  var content = ''
  var character
  var queue
  var depth

  // Eat initial spacing.
  while (++index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      index--
      break
    }

    subvalue += character
  }

  // Eat hashes.
  depth = 0

  while (++index <= length) {
    character = value.charAt(index)

    if (character !== numberSign) {
      index--
      break
    }

    subvalue += character
    depth++
  }

  if (depth > maxFenceCount) {
    return
  }

  if (!depth || (!pedantic && value.charAt(index + 1) === numberSign)) {
    return
  }

  length = value.length + 1

  // Eat intermediate white-space.
  queue = ''

  while (++index < length) {
    character = value.charAt(index)

    if (character !== space && character !== tab) {
      index--
      break
    }

    queue += character
  }

  // Exit when not in pedantic mode without spacing.
  if (!pedantic && queue.length === 0 && character && character !== lineFeed) {
    return
  }

  if (silent) {
    return true
  }

  // Eat content.
  subvalue += queue
  queue = ''
  content = ''

  while (++index < length) {
    character = value.charAt(index)

    if (!character || character === lineFeed) {
      break
    }

    if (character !== space && character !== tab && character !== numberSign) {
      content += queue + character
      queue = ''
      continue
    }

    while (character === space || character === tab) {
      queue += character
      character = value.charAt(++index)
    }

    // `#` without a queue is part of the content.
    if (!pedantic && content && !queue && character === numberSign) {
      content += character
      continue
    }

    while (character === numberSign) {
      queue += character
      character = value.charAt(++index)
    }

    while (character === space || character === tab) {
      queue += character
      character = value.charAt(++index)
    }

    index--
  }

  now.column += subvalue.length
  now.offset += subvalue.length
  subvalue += content + queue

  return eat(subvalue)({
    type: 'heading',
    depth: depth,
    children: self.tokenizeInline(content, now)
  })
}


/***/ }),

/***/ 7263:
/***/ ((module) => {

"use strict";


module.exports = setextHeading

var lineFeed = '\n'
var tab = '\t'
var space = ' '
var equalsTo = '='
var dash = '-'

var maxIndent = 3

var equalsToDepth = 1
var dashDepth = 2

function setextHeading(eat, value, silent) {
  var self = this
  var now = eat.now()
  var length = value.length
  var index = -1
  var subvalue = ''
  var content
  var queue
  var character
  var marker
  var depth

  // Eat initial indentation.
  while (++index < length) {
    character = value.charAt(index)

    if (character !== space || index >= maxIndent) {
      index--
      break
    }

    subvalue += character
  }

  // Eat content.
  content = ''
  queue = ''

  while (++index < length) {
    character = value.charAt(index)

    if (character === lineFeed) {
      index--
      break
    }

    if (character === space || character === tab) {
      queue += character
    } else {
      content += queue + character
      queue = ''
    }
  }

  now.column += subvalue.length
  now.offset += subvalue.length
  subvalue += content + queue

  // Ensure the content is followed by a newline and a valid marker.
  character = value.charAt(++index)
  marker = value.charAt(++index)

  if (character !== lineFeed || (marker !== equalsTo && marker !== dash)) {
    return
  }

  subvalue += character

  // Eat Setext-line.
  queue = marker
  depth = marker === equalsTo ? equalsToDepth : dashDepth

  while (++index < length) {
    character = value.charAt(index)

    if (character !== marker) {
      if (character !== lineFeed) {
        return
      }

      index--
      break
    }

    queue += character
  }

  if (silent) {
    return true
  }

  return eat(subvalue + queue)({
    type: 'heading',
    depth: depth,
    children: self.tokenizeInline(content, now)
  })
}


/***/ }),

/***/ 8514:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var openCloseTag = (__nccwpck_require__(9181)/* .openCloseTag */ .g)

module.exports = blockHtml

var tab = '\t'
var space = ' '
var lineFeed = '\n'
var lessThan = '<'

var rawOpenExpression = /^<(script|pre|style)(?=(\s|>|$))/i
var rawCloseExpression = /<\/(script|pre|style)>/i
var commentOpenExpression = /^<!--/
var commentCloseExpression = /-->/
var instructionOpenExpression = /^<\?/
var instructionCloseExpression = /\?>/
var directiveOpenExpression = /^<![A-Za-z]/
var directiveCloseExpression = />/
var cdataOpenExpression = /^<!\[CDATA\[/
var cdataCloseExpression = /]]>/
var elementCloseExpression = /^$/
var otherElementOpenExpression = new RegExp(openCloseTag.source + '\\s*$')

function blockHtml(eat, value, silent) {
  var self = this
  var blocks = self.options.blocks.join('|')
  var elementOpenExpression = new RegExp(
    '^</?(' + blocks + ')(?=(\\s|/?>|$))',
    'i'
  )
  var length = value.length
  var index = 0
  var next
  var line
  var offset
  var character
  var count
  var sequence
  var subvalue

  var sequences = [
    [rawOpenExpression, rawCloseExpression, true],
    [commentOpenExpression, commentCloseExpression, true],
    [instructionOpenExpression, instructionCloseExpression, true],
    [directiveOpenExpression, directiveCloseExpression, true],
    [cdataOpenExpression, cdataCloseExpression, true],
    [elementOpenExpression, elementCloseExpression, true],
    [otherElementOpenExpression, elementCloseExpression, false]
  ]

  // Eat initial spacing.
  while (index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space) {
      break
    }

    index++
  }

  if (value.charAt(index) !== lessThan) {
    return
  }

  next = value.indexOf(lineFeed, index + 1)
  next = next === -1 ? length : next
  line = value.slice(index, next)
  offset = -1
  count = sequences.length

  while (++offset < count) {
    if (sequences[offset][0].test(line)) {
      sequence = sequences[offset]
      break
    }
  }

  if (!sequence) {
    return
  }

  if (silent) {
    return sequence[2]
  }

  index = next

  if (!sequence[1].test(line)) {
    while (index < length) {
      next = value.indexOf(lineFeed, index + 1)
      next = next === -1 ? length : next
      line = value.slice(index + 1, next)

      if (sequence[1].test(line)) {
        if (line) {
          index = next
        }

        break
      }

      index = next
    }
  }

  subvalue = value.slice(0, index)

  return eat(subvalue)({type: 'html', value: subvalue})
}


/***/ }),

/***/ 9155:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var alphabetical = __nccwpck_require__(1997)
var locate = __nccwpck_require__(6330)
var tag = (__nccwpck_require__(9181)/* .tag */ ._)

module.exports = inlineHTML
inlineHTML.locator = locate

var lessThan = '<'
var questionMark = '?'
var exclamationMark = '!'
var slash = '/'

var htmlLinkOpenExpression = /^<a /i
var htmlLinkCloseExpression = /^<\/a>/i

function inlineHTML(eat, value, silent) {
  var self = this
  var length = value.length
  var character
  var subvalue

  if (value.charAt(0) !== lessThan || length < 3) {
    return
  }

  character = value.charAt(1)

  if (
    !alphabetical(character) &&
    character !== questionMark &&
    character !== exclamationMark &&
    character !== slash
  ) {
    return
  }

  subvalue = value.match(tag)

  if (!subvalue) {
    return
  }

  /* istanbul ignore if - not used yet. */
  if (silent) {
    return true
  }

  subvalue = subvalue[0]

  if (!self.inLink && htmlLinkOpenExpression.test(subvalue)) {
    self.inLink = true
  } else if (self.inLink && htmlLinkCloseExpression.test(subvalue)) {
    self.inLink = false
  }

  return eat(subvalue)({type: 'html', value: subvalue})
}


/***/ }),

/***/ 8337:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(2532)

module.exports = link
link.locator = locate

var lineFeed = '\n'
var exclamationMark = '!'
var quotationMark = '"'
var apostrophe = "'"
var leftParenthesis = '('
var rightParenthesis = ')'
var lessThan = '<'
var greaterThan = '>'
var leftSquareBracket = '['
var backslash = '\\'
var rightSquareBracket = ']'
var graveAccent = '`'

function link(eat, value, silent) {
  var self = this
  var subvalue = ''
  var index = 0
  var character = value.charAt(0)
  var pedantic = self.options.pedantic
  var commonmark = self.options.commonmark
  var gfm = self.options.gfm
  var closed
  var count
  var opening
  var beforeURL
  var beforeTitle
  var subqueue
  var hasMarker
  var isImage
  var content
  var marker
  var length
  var title
  var depth
  var queue
  var url
  var now
  var exit
  var node

  // Detect whether this is an image.
  if (character === exclamationMark) {
    isImage = true
    subvalue = character
    character = value.charAt(++index)
  }

  // Eat the opening.
  if (character !== leftSquareBracket) {
    return
  }

  // Exit when this is a link and we’re already inside a link.
  if (!isImage && self.inLink) {
    return
  }

  subvalue += character
  queue = ''
  index++

  // Eat the content.
  length = value.length
  now = eat.now()
  depth = 0

  now.column += index
  now.offset += index

  while (index < length) {
    character = value.charAt(index)
    subqueue = character

    if (character === graveAccent) {
      // Inline-code in link content.
      count = 1

      while (value.charAt(index + 1) === graveAccent) {
        subqueue += character
        index++
        count++
      }

      if (!opening) {
        opening = count
      } else if (count >= opening) {
        opening = 0
      }
    } else if (character === backslash) {
      // Allow brackets to be escaped.
      index++
      subqueue += value.charAt(index)
    } else if ((!opening || gfm) && character === leftSquareBracket) {
      // In GFM mode, brackets in code still count.  In all other modes,
      // they don’t.
      depth++
    } else if ((!opening || gfm) && character === rightSquareBracket) {
      if (depth) {
        depth--
      } else {
        if (value.charAt(index + 1) !== leftParenthesis) {
          return
        }

        subqueue += leftParenthesis
        closed = true
        index++

        break
      }
    }

    queue += subqueue
    subqueue = ''
    index++
  }

  // Eat the content closing.
  if (!closed) {
    return
  }

  content = queue
  subvalue += queue + subqueue
  index++

  // Eat white-space.
  while (index < length) {
    character = value.charAt(index)

    if (!whitespace(character)) {
      break
    }

    subvalue += character
    index++
  }

  // Eat the URL.
  character = value.charAt(index)
  queue = ''
  beforeURL = subvalue

  if (character === lessThan) {
    index++
    beforeURL += lessThan

    while (index < length) {
      character = value.charAt(index)

      if (character === greaterThan) {
        break
      }

      if (commonmark && character === lineFeed) {
        return
      }

      queue += character
      index++
    }

    if (value.charAt(index) !== greaterThan) {
      return
    }

    subvalue += lessThan + queue + greaterThan
    url = queue
    index++
  } else {
    character = null
    subqueue = ''

    while (index < length) {
      character = value.charAt(index)

      if (
        subqueue &&
        (character === quotationMark ||
          character === apostrophe ||
          (commonmark && character === leftParenthesis))
      ) {
        break
      }

      if (whitespace(character)) {
        if (!pedantic) {
          break
        }

        subqueue += character
      } else {
        if (character === leftParenthesis) {
          depth++
        } else if (character === rightParenthesis) {
          if (depth === 0) {
            break
          }

          depth--
        }

        queue += subqueue
        subqueue = ''

        if (character === backslash) {
          queue += backslash
          character = value.charAt(++index)
        }

        queue += character
      }

      index++
    }

    subvalue += queue
    url = queue
    index = subvalue.length
  }

  // Eat white-space.
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (!whitespace(character)) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)
  subvalue += queue

  // Eat the title.
  if (
    queue &&
    (character === quotationMark ||
      character === apostrophe ||
      (commonmark && character === leftParenthesis))
  ) {
    index++
    subvalue += character
    queue = ''
    marker = character === leftParenthesis ? rightParenthesis : character
    beforeTitle = subvalue

    // In commonmark-mode, things are pretty easy: the marker cannot occur
    // inside the title.  Non-commonmark does, however, support nested
    // delimiters.
    if (commonmark) {
      while (index < length) {
        character = value.charAt(index)

        if (character === marker) {
          break
        }

        if (character === backslash) {
          queue += backslash
          character = value.charAt(++index)
        }

        index++
        queue += character
      }

      character = value.charAt(index)

      if (character !== marker) {
        return
      }

      title = queue
      subvalue += queue + character
      index++

      while (index < length) {
        character = value.charAt(index)

        if (!whitespace(character)) {
          break
        }

        subvalue += character
        index++
      }
    } else {
      subqueue = ''

      while (index < length) {
        character = value.charAt(index)

        if (character === marker) {
          if (hasMarker) {
            queue += marker + subqueue
            subqueue = ''
          }

          hasMarker = true
        } else if (!hasMarker) {
          queue += character
        } else if (character === rightParenthesis) {
          subvalue += queue + marker + subqueue
          title = queue
          break
        } else if (whitespace(character)) {
          subqueue += character
        } else {
          queue += marker + subqueue + character
          subqueue = ''
          hasMarker = false
        }

        index++
      }
    }
  }

  if (value.charAt(index) !== rightParenthesis) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  subvalue += rightParenthesis

  url = self.decode.raw(self.unescape(url), eat(beforeURL).test().end, {
    nonTerminated: false
  })

  if (title) {
    beforeTitle = eat(beforeTitle).test().end
    title = self.decode.raw(self.unescape(title), beforeTitle)
  }

  node = {
    type: isImage ? 'image' : 'link',
    title: title || null,
    url: url
  }

  if (isImage) {
    node.alt = self.decode.raw(self.unescape(content), now) || null
  } else {
    exit = self.enterLink()
    node.children = self.tokenizeInline(content, now)
    exit()
  }

  return eat(subvalue)(node)
}


/***/ }),

/***/ 3766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var repeat = __nccwpck_require__(6976)
var decimal = __nccwpck_require__(5552)
var getIndent = __nccwpck_require__(8059)
var removeIndent = __nccwpck_require__(1180)
var interrupt = __nccwpck_require__(1783)

module.exports = list

var asterisk = '*'
var underscore = '_'
var plusSign = '+'
var dash = '-'
var dot = '.'
var space = ' '
var lineFeed = '\n'
var tab = '\t'
var rightParenthesis = ')'
var lowercaseX = 'x'

var tabSize = 4
var looseListItemExpression = /\n\n(?!\s*$)/
var taskItemExpression = /^\[([ X\tx])][ \t]/
var bulletExpression = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/
var pedanticBulletExpression = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/
var initialIndentExpression = /^( {1,4}|\t)?/gm

function list(eat, value, silent) {
  var self = this
  var commonmark = self.options.commonmark
  var pedantic = self.options.pedantic
  var tokenizers = self.blockTokenizers
  var interuptors = self.interruptList
  var index = 0
  var length = value.length
  var start = null
  var size
  var queue
  var ordered
  var character
  var marker
  var nextIndex
  var startIndex
  var prefixed
  var currentMarker
  var content
  var line
  var previousEmpty
  var empty
  var items
  var allLines
  var emptyLines
  var item
  var enterTop
  var exitBlockquote
  var spread = false
  var node
  var now
  var end
  var indented

  while (index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space) {
      break
    }

    index++
  }

  character = value.charAt(index)

  if (character === asterisk || character === plusSign || character === dash) {
    marker = character
    ordered = false
  } else {
    ordered = true
    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (!decimal(character)) {
        break
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (
      !queue ||
      !(character === dot || (commonmark && character === rightParenthesis))
    ) {
      return
    }

    /* Slightly abusing `silent` mode, whose goal is to make interrupting
     * paragraphs work.
     * Well, that’s exactly what we want to do here: don’t interrupt:
     * 2. here, because the “list” doesn’t start with `1`. */
    if (silent && queue !== '1') {
      return
    }

    start = parseInt(queue, 10)
    marker = character
  }

  character = value.charAt(++index)

  if (
    character !== space &&
    character !== tab &&
    (pedantic || (character !== lineFeed && character !== ''))
  ) {
    return
  }

  if (silent) {
    return true
  }

  index = 0
  items = []
  allLines = []
  emptyLines = []

  while (index < length) {
    nextIndex = value.indexOf(lineFeed, index)
    startIndex = index
    prefixed = false
    indented = false

    if (nextIndex === -1) {
      nextIndex = length
    }

    size = 0

    while (index < length) {
      character = value.charAt(index)

      if (character === tab) {
        size += tabSize - (size % tabSize)
      } else if (character === space) {
        size++
      } else {
        break
      }

      index++
    }

    if (item && size >= item.indent) {
      indented = true
    }

    character = value.charAt(index)
    currentMarker = null

    if (!indented) {
      if (
        character === asterisk ||
        character === plusSign ||
        character === dash
      ) {
        currentMarker = character
        index++
        size++
      } else {
        queue = ''

        while (index < length) {
          character = value.charAt(index)

          if (!decimal(character)) {
            break
          }

          queue += character
          index++
        }

        character = value.charAt(index)
        index++

        if (
          queue &&
          (character === dot || (commonmark && character === rightParenthesis))
        ) {
          currentMarker = character
          size += queue.length + 1
        }
      }

      if (currentMarker) {
        character = value.charAt(index)

        if (character === tab) {
          size += tabSize - (size % tabSize)
          index++
        } else if (character === space) {
          end = index + tabSize

          while (index < end) {
            if (value.charAt(index) !== space) {
              break
            }

            index++
            size++
          }

          if (index === end && value.charAt(index) === space) {
            index -= tabSize - 1
            size -= tabSize - 1
          }
        } else if (character !== lineFeed && character !== '') {
          currentMarker = null
        }
      }
    }

    if (currentMarker) {
      if (!pedantic && marker !== currentMarker) {
        break
      }

      prefixed = true
    } else {
      if (!commonmark && !indented && value.charAt(startIndex) === space) {
        indented = true
      } else if (commonmark && item) {
        indented = size >= item.indent || size > tabSize
      }

      prefixed = false
      index = startIndex
    }

    line = value.slice(startIndex, nextIndex)
    content = startIndex === index ? line : value.slice(index, nextIndex)

    if (
      currentMarker === asterisk ||
      currentMarker === underscore ||
      currentMarker === dash
    ) {
      if (tokenizers.thematicBreak.call(self, eat, line, true)) {
        break
      }
    }

    previousEmpty = empty
    empty = !prefixed && !trim(content).length

    if (indented && item) {
      item.value = item.value.concat(emptyLines, line)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    } else if (prefixed) {
      if (emptyLines.length !== 0) {
        spread = true
        item.value.push('')
        item.trail = emptyLines.concat()
      }

      item = {
        value: [line],
        indent: size,
        trail: []
      }

      items.push(item)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    } else if (empty) {
      if (previousEmpty && !commonmark) {
        break
      }

      emptyLines.push(line)
    } else {
      if (previousEmpty) {
        break
      }

      if (interrupt(interuptors, tokenizers, self, [eat, line, true])) {
        break
      }

      item.value = item.value.concat(emptyLines, line)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    }

    index = nextIndex + 1
  }

  node = eat(allLines.join(lineFeed)).reset({
    type: 'list',
    ordered: ordered,
    start: start,
    spread: spread,
    children: []
  })

  enterTop = self.enterList()
  exitBlockquote = self.enterBlock()
  index = -1
  length = items.length

  while (++index < length) {
    item = items[index].value.join(lineFeed)
    now = eat.now()

    eat(item)(listItem(self, item, now), node)

    item = items[index].trail.join(lineFeed)

    if (index !== length - 1) {
      item += lineFeed
    }

    eat(item)
  }

  enterTop()
  exitBlockquote()

  return node
}

function listItem(ctx, value, position) {
  var offsets = ctx.offset
  var fn = ctx.options.pedantic ? pedanticListItem : normalListItem
  var checked = null
  var task
  var indent

  value = fn.apply(null, arguments)

  if (ctx.options.gfm) {
    task = value.match(taskItemExpression)

    if (task) {
      indent = task[0].length
      checked = task[1].toLowerCase() === lowercaseX
      offsets[position.line] += indent
      value = value.slice(indent)
    }
  }

  return {
    type: 'listItem',
    spread: looseListItemExpression.test(value),
    checked: checked,
    children: ctx.tokenizeBlock(value, position)
  }
}

// Create a list-item using overly simple mechanics.
function pedanticListItem(ctx, value, position) {
  var offsets = ctx.offset
  var line = position.line

  // Remove the list-item’s bullet.
  value = value.replace(pedanticBulletExpression, replacer)

  // The initial line was also matched by the below, so we reset the `line`.
  line = position.line

  return value.replace(initialIndentExpression, replacer)

  // A simple replacer which removed all matches, and adds their length to
  // `offset`.
  function replacer($0) {
    offsets[line] = (offsets[line] || 0) + $0.length
    line++

    return ''
  }
}

// Create a list-item using sane mechanics.
function normalListItem(ctx, value, position) {
  var offsets = ctx.offset
  var line = position.line
  var max
  var bullet
  var rest
  var lines
  var trimmedLines
  var index
  var length

  // Remove the list-item’s bullet.
  value = value.replace(bulletExpression, replacer)

  lines = value.split(lineFeed)

  trimmedLines = removeIndent(value, getIndent(max).indent).split(lineFeed)

  // We replaced the initial bullet with something else above, which was used
  // to trick `removeIndentation` into removing some more characters when
  // possible.  However, that could result in the initial line to be stripped
  // more than it should be.
  trimmedLines[0] = rest

  offsets[line] = (offsets[line] || 0) + bullet.length
  line++

  index = 0
  length = lines.length

  while (++index < length) {
    offsets[line] =
      (offsets[line] || 0) + lines[index].length - trimmedLines[index].length
    line++
  }

  return trimmedLines.join(lineFeed)

  /* eslint-disable-next-line max-params */
  function replacer($0, $1, $2, $3, $4) {
    bullet = $1 + $2 + $3
    rest = $4

    // Make sure that the first nine numbered list items can indent with an
    // extra space.  That is, when the bullet did not receive an extra final
    // space.
    if (Number($2) < 10 && bullet.length % 2 === 1) {
      $2 = space + $2
    }

    max = $1 + repeat(space, $2.length) + $3

    return max + rest
  }
}


/***/ }),

/***/ 2082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var trimTrailingLines = __nccwpck_require__(3199)
var interrupt = __nccwpck_require__(1783)

module.exports = paragraph

var tab = '\t'
var lineFeed = '\n'
var space = ' '

var tabSize = 4

// Tokenise paragraph.
function paragraph(eat, value, silent) {
  var self = this
  var settings = self.options
  var commonmark = settings.commonmark
  var tokenizers = self.blockTokenizers
  var interruptors = self.interruptParagraph
  var index = value.indexOf(lineFeed)
  var length = value.length
  var position
  var subvalue
  var character
  var size
  var now

  while (index < length) {
    // Eat everything if there’s no following newline.
    if (index === -1) {
      index = length
      break
    }

    // Stop if the next character is NEWLINE.
    if (value.charAt(index + 1) === lineFeed) {
      break
    }

    // In commonmark-mode, following indented lines are part of the paragraph.
    if (commonmark) {
      size = 0
      position = index + 1

      while (position < length) {
        character = value.charAt(position)

        if (character === tab) {
          size = tabSize
          break
        } else if (character === space) {
          size++
        } else {
          break
        }

        position++
      }

      if (size >= tabSize && character !== lineFeed) {
        index = value.indexOf(lineFeed, index + 1)
        continue
      }
    }

    subvalue = value.slice(index + 1)

    // Check if the following code contains a possible block.
    if (interrupt(interruptors, tokenizers, self, [eat, subvalue, true])) {
      break
    }

    position = index
    index = value.indexOf(lineFeed, index + 1)

    if (index !== -1 && trim(value.slice(position, index)) === '') {
      index = position
      break
    }
  }

  subvalue = value.slice(0, index)

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  now = eat.now()
  subvalue = trimTrailingLines(subvalue)

  return eat(subvalue)({
    type: 'paragraph',
    children: self.tokenizeInline(subvalue, now)
  })
}


/***/ }),

/***/ 3699:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(2532)
var normalize = __nccwpck_require__(2482)

module.exports = reference
reference.locator = locate

var link = 'link'
var image = 'image'
var shortcut = 'shortcut'
var collapsed = 'collapsed'
var full = 'full'
var exclamationMark = '!'
var leftSquareBracket = '['
var backslash = '\\'
var rightSquareBracket = ']'

function reference(eat, value, silent) {
  var self = this
  var commonmark = self.options.commonmark
  var character = value.charAt(0)
  var index = 0
  var length = value.length
  var subvalue = ''
  var intro = ''
  var type = link
  var referenceType = shortcut
  var content
  var identifier
  var now
  var node
  var exit
  var queue
  var bracketed
  var depth

  // Check whether we’re eating an image.
  if (character === exclamationMark) {
    type = image
    intro = character
    character = value.charAt(++index)
  }

  if (character !== leftSquareBracket) {
    return
  }

  index++
  intro += character
  queue = ''

  // Eat the text.
  depth = 0

  while (index < length) {
    character = value.charAt(index)

    if (character === leftSquareBracket) {
      bracketed = true
      depth++
    } else if (character === rightSquareBracket) {
      if (!depth) {
        break
      }

      depth--
    }

    if (character === backslash) {
      queue += backslash
      character = value.charAt(++index)
    }

    queue += character
    index++
  }

  subvalue = queue
  content = queue
  character = value.charAt(index)

  if (character !== rightSquareBracket) {
    return
  }

  index++
  subvalue += character
  queue = ''

  if (!commonmark) {
    // The original markdown syntax definition explicitly allows for whitespace
    // between the link text and link label; commonmark departs from this, in
    // part to improve support for shortcut reference links
    while (index < length) {
      character = value.charAt(index)

      if (!whitespace(character)) {
        break
      }

      queue += character
      index++
    }
  }

  character = value.charAt(index)

  if (character === leftSquareBracket) {
    identifier = ''
    queue += character
    index++

    while (index < length) {
      character = value.charAt(index)

      if (character === leftSquareBracket || character === rightSquareBracket) {
        break
      }

      if (character === backslash) {
        identifier += backslash
        character = value.charAt(++index)
      }

      identifier += character
      index++
    }

    character = value.charAt(index)

    if (character === rightSquareBracket) {
      referenceType = identifier ? full : collapsed
      queue += identifier + character
      index++
    } else {
      identifier = ''
    }

    subvalue += queue
    queue = ''
  } else {
    if (!content) {
      return
    }

    identifier = content
  }

  // Brackets cannot be inside the identifier.
  if (referenceType !== full && bracketed) {
    return
  }

  subvalue = intro + subvalue

  if (type === link && self.inLink) {
    return null
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  now = eat.now()
  now.column += intro.length
  now.offset += intro.length
  identifier = referenceType === full ? identifier : content

  node = {
    type: type + 'Reference',
    identifier: normalize(identifier),
    label: identifier,
    referenceType: referenceType
  }

  if (type === link) {
    exit = self.enterLink()
    node.children = self.tokenizeInline(content, now)
    exit()
  } else {
    node.alt = self.decode.raw(self.unescape(content), now) || null
  }

  return eat(subvalue)(node)
}


/***/ }),

/***/ 9569:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(5514)

module.exports = strong
strong.locator = locate

var backslash = '\\'
var asterisk = '*'
var underscore = '_'

function strong(eat, value, silent) {
  var self = this
  var index = 0
  var character = value.charAt(index)
  var now
  var pedantic
  var marker
  var queue
  var subvalue
  var length
  var previous

  if (
    (character !== asterisk && character !== underscore) ||
    value.charAt(++index) !== character
  ) {
    return
  }

  pedantic = self.options.pedantic
  marker = character
  subvalue = marker + marker
  length = value.length
  index++
  queue = ''
  character = ''

  if (pedantic && whitespace(value.charAt(index))) {
    return
  }

  while (index < length) {
    previous = character
    character = value.charAt(index)

    if (
      character === marker &&
      value.charAt(index + 1) === marker &&
      (!pedantic || !whitespace(previous))
    ) {
      character = value.charAt(index + 2)

      if (character !== marker) {
        if (!trim(queue)) {
          return
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        now = eat.now()
        now.column += 2
        now.offset += 2

        return eat(subvalue + queue + subvalue)({
          type: 'strong',
          children: self.tokenizeInline(queue, now)
        })
      }
    }

    if (!pedantic && character === backslash) {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
}


/***/ }),

/***/ 3274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var whitespace = __nccwpck_require__(8473)

module.exports = table

var tab = '\t'
var lineFeed = '\n'
var space = ' '
var dash = '-'
var colon = ':'
var backslash = '\\'
var verticalBar = '|'

var minColumns = 1
var minRows = 2

var left = 'left'
var center = 'center'
var right = 'right'

function table(eat, value, silent) {
  var self = this
  var index
  var alignments
  var alignment
  var subvalue
  var row
  var length
  var lines
  var queue
  var character
  var hasDash
  var align
  var cell
  var preamble
  var now
  var position
  var lineCount
  var line
  var rows
  var table
  var lineIndex
  var pipeIndex
  var first

  // Exit when not in gfm-mode.
  if (!self.options.gfm) {
    return
  }

  // Get the rows.
  // Detecting tables soon is hard, so there are some checks for performance
  // here, such as the minimum number of rows, and allowed characters in the
  // alignment row.
  index = 0
  lineCount = 0
  length = value.length + 1
  lines = []

  while (index < length) {
    lineIndex = value.indexOf(lineFeed, index)
    pipeIndex = value.indexOf(verticalBar, index + 1)

    if (lineIndex === -1) {
      lineIndex = value.length
    }

    if (pipeIndex === -1 || pipeIndex > lineIndex) {
      if (lineCount < minRows) {
        return
      }

      break
    }

    lines.push(value.slice(index, lineIndex))
    lineCount++
    index = lineIndex + 1
  }

  // Parse the alignment row.
  subvalue = lines.join(lineFeed)
  alignments = lines.splice(1, 1)[0] || []
  index = 0
  length = alignments.length
  lineCount--
  alignment = false
  align = []

  while (index < length) {
    character = alignments.charAt(index)

    if (character === verticalBar) {
      hasDash = null

      if (alignment === false) {
        if (first === false) {
          return
        }
      } else {
        align.push(alignment)
        alignment = false
      }

      first = false
    } else if (character === dash) {
      hasDash = true
      alignment = alignment || null
    } else if (character === colon) {
      if (alignment === left) {
        alignment = center
      } else if (hasDash && alignment === null) {
        alignment = right
      } else {
        alignment = left
      }
    } else if (!whitespace(character)) {
      return
    }

    index++
  }

  if (alignment !== false) {
    align.push(alignment)
  }

  // Exit when without enough columns.
  if (align.length < minColumns) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  // Parse the rows.
  position = -1
  rows = []

  table = eat(subvalue).reset({type: 'table', align: align, children: rows})

  while (++position < lineCount) {
    line = lines[position]
    row = {type: 'tableRow', children: []}

    // Eat a newline character when this is not the first row.
    if (position) {
      eat(lineFeed)
    }

    // Eat the row.
    eat(line).reset(row, table)

    length = line.length + 1
    index = 0
    queue = ''
    cell = ''
    preamble = true

    while (index < length) {
      character = line.charAt(index)

      if (character === tab || character === space) {
        if (cell) {
          queue += character
        } else {
          eat(character)
        }

        index++
        continue
      }

      if (character === '' || character === verticalBar) {
        if (preamble) {
          eat(character)
        } else {
          if ((cell || character) && !preamble) {
            subvalue = cell

            if (queue.length > 1) {
              if (character) {
                subvalue += queue.slice(0, -1)
                queue = queue.charAt(queue.length - 1)
              } else {
                subvalue += queue
                queue = ''
              }
            }

            now = eat.now()

            eat(subvalue)(
              {type: 'tableCell', children: self.tokenizeInline(cell, now)},
              row
            )
          }

          eat(queue + character)

          queue = ''
          cell = ''
        }
      } else {
        if (queue) {
          cell += queue
          queue = ''
        }

        cell += character

        if (character === backslash && index !== length - 2) {
          cell += line.charAt(index + 1)
          index++
        }
      }

      preamble = false
      index++
    }

    // Eat the alignment row.
    if (!position) {
      eat(lineFeed + alignments)
    }
  }

  return table
}


/***/ }),

/***/ 9916:
/***/ ((module) => {

"use strict";


module.exports = text

function text(eat, value, silent) {
  var self = this
  var methods
  var tokenizers
  var index
  var length
  var subvalue
  var position
  var tokenizer
  var name
  var min
  var now

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  methods = self.inlineMethods
  length = methods.length
  tokenizers = self.inlineTokenizers
  index = -1
  min = value.length

  while (++index < length) {
    name = methods[index]

    if (name === 'text' || !tokenizers[name]) {
      continue
    }

    tokenizer = tokenizers[name].locator

    if (!tokenizer) {
      eat.file.fail('Missing locator: `' + name + '`')
    }

    position = tokenizer.call(self, value, 1)

    if (position !== -1 && position < min) {
      min = position
    }
  }

  subvalue = value.slice(0, min)
  now = eat.now()

  self.decode(subvalue, now, handler)

  function handler(content, position, source) {
    eat(source || content)({type: 'text', value: content})
  }
}


/***/ }),

/***/ 2763:
/***/ ((module) => {

"use strict";


module.exports = thematicBreak

var tab = '\t'
var lineFeed = '\n'
var space = ' '
var asterisk = '*'
var dash = '-'
var underscore = '_'

var maxCount = 3

function thematicBreak(eat, value, silent) {
  var index = -1
  var length = value.length + 1
  var subvalue = ''
  var character
  var marker
  var markerCount
  var queue

  while (++index < length) {
    character = value.charAt(index)

    if (character !== tab && character !== space) {
      break
    }

    subvalue += character
  }

  if (
    character !== asterisk &&
    character !== dash &&
    character !== underscore
  ) {
    return
  }

  marker = character
  subvalue += character
  markerCount = 1
  queue = ''

  while (++index < length) {
    character = value.charAt(index)

    if (character === marker) {
      markerCount++
      subvalue += queue + marker
      queue = ''
    } else if (character === space) {
      queue += character
    } else if (
      markerCount >= maxCount &&
      (!character || character === lineFeed)
    ) {
      subvalue += queue

      if (silent) {
        return true
      }

      return eat(subvalue)({type: 'thematicBreak'})
    } else {
      return
    }
  }
}


/***/ }),

/***/ 5069:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var ccount = __nccwpck_require__(1291)
var decode = __nccwpck_require__(8859)
var decimal = __nccwpck_require__(5552)
var alphabetical = __nccwpck_require__(1997)
var whitespace = __nccwpck_require__(8473)
var locate = __nccwpck_require__(327)

module.exports = url
url.locator = locate
url.notInLink = true

var exclamationMark = 33 // '!'
var ampersand = 38 // '&'
var rightParenthesis = 41 // ')'
var asterisk = 42 // '*'
var comma = 44 // ','
var dash = 45 // '-'
var dot = 46 // '.'
var colon = 58 // ':'
var semicolon = 59 // ';'
var questionMark = 63 // '?'
var lessThan = 60 // '<'
var underscore = 95 // '_'
var tilde = 126 // '~'

var leftParenthesisCharacter = '('
var rightParenthesisCharacter = ')'

function url(eat, value, silent) {
  var self = this
  var gfm = self.options.gfm
  var tokenizers = self.inlineTokenizers
  var length = value.length
  var previousDot = -1
  var protocolless = false
  var dots
  var lastTwoPartsStart
  var start
  var index
  var pathStart
  var path
  var code
  var end
  var leftCount
  var rightCount
  var content
  var children
  var url
  var exit

  if (!gfm) {
    return
  }

  // `WWW.` doesn’t work.
  if (value.slice(0, 4) === 'www.') {
    protocolless = true
    index = 4
  } else if (value.slice(0, 7).toLowerCase() === 'http://') {
    index = 7
  } else if (value.slice(0, 8).toLowerCase() === 'https://') {
    index = 8
  } else {
    return
  }

  // Act as if the starting boundary is a dot.
  previousDot = index - 1

  // Parse a valid domain.
  start = index
  dots = []

  while (index < length) {
    code = value.charCodeAt(index)

    if (code === dot) {
      // Dots may not appear after each other.
      if (previousDot === index - 1) {
        break
      }

      dots.push(index)
      previousDot = index
      index++
      continue
    }

    if (
      decimal(code) ||
      alphabetical(code) ||
      code === dash ||
      code === underscore
    ) {
      index++
      continue
    }

    break
  }

  // Ignore a final dot:
  if (code === dot) {
    dots.pop()
    index--
  }

  // If there are not dots, exit.
  if (dots[0] === undefined) {
    return
  }

  // If there is an underscore in the last two domain parts, exit:
  // `www.example.c_m` and `www.ex_ample.com` are not OK, but
  // `www.sub_domain.example.com` is.
  lastTwoPartsStart = dots.length < 2 ? start : dots[dots.length - 2] + 1

  if (value.slice(lastTwoPartsStart, index).indexOf('_') !== -1) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  end = index
  pathStart = index

  // Parse a path.
  while (index < length) {
    code = value.charCodeAt(index)

    if (whitespace(code) || code === lessThan) {
      break
    }

    index++

    if (
      code === exclamationMark ||
      code === asterisk ||
      code === comma ||
      code === dot ||
      code === colon ||
      code === questionMark ||
      code === underscore ||
      code === tilde
    ) {
      // Empty
    } else {
      end = index
    }
  }

  index = end

  // If the path ends in a closing paren, and the count of closing parens is
  // higher than the opening count, then remove the supefluous closing parens.
  if (value.charCodeAt(index - 1) === rightParenthesis) {
    path = value.slice(pathStart, index)
    leftCount = ccount(path, leftParenthesisCharacter)
    rightCount = ccount(path, rightParenthesisCharacter)

    while (rightCount > leftCount) {
      index = pathStart + path.lastIndexOf(rightParenthesisCharacter)
      path = value.slice(pathStart, index)
      rightCount--
    }
  }

  if (value.charCodeAt(index - 1) === semicolon) {
    // GitHub doesn’t document this, but final semicolons aren’t paret of the
    // URL either.
    index--

    // // If the path ends in what looks like an entity, it’s not part of the path.
    if (alphabetical(value.charCodeAt(index - 1))) {
      end = index - 2

      while (alphabetical(value.charCodeAt(end))) {
        end--
      }

      if (value.charCodeAt(end) === ampersand) {
        index = end
      }
    }
  }

  content = value.slice(0, index)
  url = decode(content, {nonTerminated: false})

  if (protocolless) {
    url = 'http://' + url
  }

  exit = self.enterLink()

  // Temporarily remove all tokenizers except text in url.
  self.inlineTokenizers = {text: tokenizers.text}
  children = self.tokenizeInline(content, eat.now())
  self.inlineTokenizers = tokenizers

  exit()

  return eat(content)({type: 'link', title: null, url: url, children: children})
}


/***/ }),

/***/ 8970:
/***/ ((module) => {

"use strict";


module.exports = factory

// Construct a tokenizer.  This creates both `tokenizeInline` and `tokenizeBlock`.
function factory(type) {
  return tokenize

  // Tokenizer for a bound `type`.
  function tokenize(value, location) {
    var self = this
    var offset = self.offset
    var tokens = []
    var methods = self[type + 'Methods']
    var tokenizers = self[type + 'Tokenizers']
    var line = location.line
    var column = location.column
    var index
    var length
    var method
    var name
    var matched
    var valueLength

    // Trim white space only lines.
    if (!value) {
      return tokens
    }

    // Expose on `eat`.
    eat.now = now
    eat.file = self.file

    // Sync initial offset.
    updatePosition('')

    // Iterate over `value`, and iterate over all tokenizers.  When one eats
    // something, re-iterate with the remaining value.  If no tokenizer eats,
    // something failed (should not happen) and an exception is thrown.
    while (value) {
      index = -1
      length = methods.length
      matched = false

      while (++index < length) {
        name = methods[index]
        method = tokenizers[name]

        // Previously, we had constructs such as footnotes and YAML that used
        // these properties.
        // Those are now external (plus there are userland extensions), that may
        // still use them.
        if (
          method &&
          /* istanbul ignore next */ (!method.onlyAtStart || self.atStart) &&
          /* istanbul ignore next */ (!method.notInList || !self.inList) &&
          /* istanbul ignore next */ (!method.notInBlock || !self.inBlock) &&
          (!method.notInLink || !self.inLink)
        ) {
          valueLength = value.length

          method.apply(self, [eat, value])

          matched = valueLength !== value.length

          if (matched) {
            break
          }
        }
      }

      /* istanbul ignore if */
      if (!matched) {
        self.file.fail(new Error('Infinite loop'), eat.now())
      }
    }

    self.eof = now()

    return tokens

    // Update line, column, and offset based on `value`.
    function updatePosition(subvalue) {
      var lastIndex = -1
      var index = subvalue.indexOf('\n')

      while (index !== -1) {
        line++
        lastIndex = index
        index = subvalue.indexOf('\n', index + 1)
      }

      if (lastIndex === -1) {
        column += subvalue.length
      } else {
        column = subvalue.length - lastIndex
      }

      if (line in offset) {
        if (lastIndex !== -1) {
          column += offset[line]
        } else if (column <= offset[line]) {
          column = offset[line] + 1
        }
      }
    }

    // Get offset.  Called before the first character is eaten to retrieve the
    // range’s offsets.
    function getOffset() {
      var indentation = []
      var pos = line + 1

      // Done.  Called when the last character is eaten to retrieve the range’s
      // offsets.
      return function () {
        var last = line + 1

        while (pos < last) {
          indentation.push((offset[pos] || 0) + 1)

          pos++
        }

        return indentation
      }
    }

    // Get the current position.
    function now() {
      var pos = {line: line, column: column}

      pos.offset = self.toOffset(pos)

      return pos
    }

    // Store position information for a node.
    function Position(start) {
      this.start = start
      this.end = now()
    }

    // Throw when a value is incorrectly eaten.  This shouldn’t happen but will
    // throw on new, incorrect rules.
    function validateEat(subvalue) {
      /* istanbul ignore if */
      if (value.slice(0, subvalue.length) !== subvalue) {
        // Capture stack-trace.
        self.file.fail(
          new Error(
            'Incorrectly eaten value: please report this warning on https://git.io/vg5Ft'
          ),
          now()
        )
      }
    }

    // Mark position and patch `node.position`.
    function position() {
      var before = now()

      return update

      // Add the position to a node.
      function update(node, indent) {
        var previous = node.position
        var start = previous ? previous.start : before
        var combined = []
        var n = previous && previous.end.line
        var l = before.line

        node.position = new Position(start)

        // If there was already a `position`, this node was merged.  Fixing
        // `start` wasn’t hard, but the indent is different.  Especially
        // because some information, the indent between `n` and `l` wasn’t
        // tracked.  Luckily, that space is (should be?) empty, so we can
        // safely check for it now.
        if (previous && indent && previous.indent) {
          combined = previous.indent

          if (n < l) {
            while (++n < l) {
              combined.push((offset[n] || 0) + 1)
            }

            combined.push(before.column)
          }

          indent = combined.concat(indent)
        }

        node.position.indent = indent || []

        return node
      }
    }

    // Add `node` to `parent`s children or to `tokens`.  Performs merges where
    // possible.
    function add(node, parent) {
      var children = parent ? parent.children : tokens
      var previous = children[children.length - 1]
      var fn

      if (
        previous &&
        node.type === previous.type &&
        (node.type === 'text' || node.type === 'blockquote') &&
        mergeable(previous) &&
        mergeable(node)
      ) {
        fn = node.type === 'text' ? mergeText : mergeBlockquote
        node = fn.call(self, previous, node)
      }

      if (node !== previous) {
        children.push(node)
      }

      if (self.atStart && tokens.length !== 0) {
        self.exitStart()
      }

      return node
    }

    // Remove `subvalue` from `value`.  `subvalue` must be at the start of
    // `value`.
    function eat(subvalue) {
      var indent = getOffset()
      var pos = position()
      var current = now()

      validateEat(subvalue)

      apply.reset = reset
      reset.test = test
      apply.test = test

      value = value.slice(subvalue.length)

      updatePosition(subvalue)

      indent = indent()

      return apply

      // Add the given arguments, add `position` to the returned node, and
      // return the node.
      function apply(node, parent) {
        return pos(add(pos(node), parent), indent)
      }

      // Functions just like apply, but resets the content: the line and
      // column are reversed, and the eaten value is re-added.   This is
      // useful for nodes with a single type of content, such as lists and
      // tables.  See `apply` above for what parameters are expected.
      function reset() {
        var node = apply.apply(null, arguments)

        line = current.line
        column = current.column
        value = subvalue + value

        return node
      }

      // Test the position, after eating, and reverse to a not-eaten state.
      function test() {
        var result = pos({})

        line = current.line
        column = current.column
        value = subvalue + value

        return result.position
      }
    }
  }
}

// Check whether a node is mergeable with adjacent nodes.
function mergeable(node) {
  var start
  var end

  if (node.type !== 'text' || !node.position) {
    return true
  }

  start = node.position.start
  end = node.position.end

  // Only merge nodes which occupy the same size as their `value`.
  return (
    start.line !== end.line || end.column - start.column === node.value.length
  )
}

// Merge two text nodes: `node` into `prev`.
function mergeText(previous, node) {
  previous.value += node.value

  return previous
}

// Merge two blockquotes: `node` into `prev`, unless in CommonMark or gfm modes.
function mergeBlockquote(previous, node) {
  if (this.options.commonmark || this.options.gfm) {
    return node
  }

  previous.children = previous.children.concat(node.children)

  return previous
}


/***/ }),

/***/ 4063:
/***/ ((module) => {

"use strict";


module.exports = factory

var backslash = '\\'

// Factory to de-escape a value, based on a list at `key` in `ctx`.
function factory(ctx, key) {
  return unescape

  // De-escape a string using the expression at `key` in `ctx`.
  function unescape(value) {
    var previous = 0
    var index = value.indexOf(backslash)
    var escape = ctx[key]
    var queue = []
    var character

    while (index !== -1) {
      queue.push(value.slice(previous, index))
      previous = index + 1
      character = value.charAt(previous)

      // If the following character is not a valid escape, add the slash.
      if (!character || escape.indexOf(character) === -1) {
        queue.push(backslash)
      }

      index = value.indexOf(backslash, previous + 1)
    }

    queue.push(value.slice(previous))

    return queue.join('')
  }
}


/***/ }),

/***/ 8059:
/***/ ((module) => {

"use strict";


module.exports = indentation

var tab = '\t'
var space = ' '

var spaceSize = 1
var tabSize = 4

// Gets indentation information for a line.
function indentation(value) {
  var index = 0
  var indent = 0
  var character = value.charAt(index)
  var stops = {}
  var size
  var lastIndent = 0

  while (character === tab || character === space) {
    size = character === tab ? tabSize : spaceSize

    indent += size

    if (size > 1) {
      indent = Math.floor(indent / size) * size
    }

    while (lastIndent < indent) {
      stops[++lastIndent] = index
    }

    character = value.charAt(++index)
  }

  return {indent: indent, stops: stops}
}


/***/ }),

/***/ 9181:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var attributeName = '[a-zA-Z_:][a-zA-Z0-9:._-]*'
var unquoted = '[^"\'=<>`\\u0000-\\u0020]+'
var singleQuoted = "'[^']*'"
var doubleQuoted = '"[^"]*"'
var attributeValue =
  '(?:' + unquoted + '|' + singleQuoted + '|' + doubleQuoted + ')'
var attribute =
  '(?:\\s+' + attributeName + '(?:\\s*=\\s*' + attributeValue + ')?)'
var openTag = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>'
var closeTag = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>'
var comment = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->'
var processing = '<[?].*?[?]>'
var declaration = '<![A-Za-z]+\\s+[^>]*>'
var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'

exports.g = new RegExp('^(?:' + openTag + '|' + closeTag + ')')

exports._ = new RegExp(
  '^(?:' +
    openTag +
    '|' +
    closeTag +
    '|' +
    comment +
    '|' +
    processing +
    '|' +
    declaration +
    '|' +
    cdata +
    ')'
)


/***/ }),

/***/ 1783:
/***/ ((module) => {

"use strict";


module.exports = interrupt

function interrupt(interruptors, tokenizers, ctx, parameters) {
  var length = interruptors.length
  var index = -1
  var interruptor
  var config

  while (++index < length) {
    interruptor = interruptors[index]
    config = interruptor[1] || {}

    if (
      config.pedantic !== undefined &&
      config.pedantic !== ctx.options.pedantic
    ) {
      continue
    }

    if (
      config.commonmark !== undefined &&
      config.commonmark !== ctx.options.commonmark
    ) {
      continue
    }

    if (tokenizers[interruptor[0]].apply(ctx, parameters)) {
      return true
    }
  }

  return false
}


/***/ }),

/***/ 2482:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var collapseWhiteSpace = __nccwpck_require__(8201)

module.exports = normalize

// Normalize an identifier.  Collapses multiple white space characters into a
// single space, and removes casing.
function normalize(value) {
  return collapseWhiteSpace(value).toLowerCase()
}


/***/ }),

/***/ 1180:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var trim = __nccwpck_require__(4065)
var repeat = __nccwpck_require__(6976)
var getIndent = __nccwpck_require__(8059)

module.exports = indentation

var lineFeed = '\n'
var space = ' '
var exclamationMark = '!'

// Remove the minimum indent from every line in `value`.  Supports both tab,
// spaced, and mixed indentation (as well as possible).
function indentation(value, maximum) {
  var values = value.split(lineFeed)
  var position = values.length + 1
  var minIndent = Infinity
  var matrix = []
  var index
  var indentation
  var stops

  values.unshift(repeat(space, maximum) + exclamationMark)

  while (position--) {
    indentation = getIndent(values[position])

    matrix[position] = indentation.stops

    if (trim(values[position]).length === 0) {
      continue
    }

    if (indentation.indent) {
      if (indentation.indent > 0 && indentation.indent < minIndent) {
        minIndent = indentation.indent
      }
    } else {
      minIndent = Infinity

      break
    }
  }

  if (minIndent !== Infinity) {
    position = values.length

    while (position--) {
      stops = matrix[position]
      index = minIndent

      while (index && !(index in stops)) {
        index--
      }

      values[position] = values[position].slice(stops[index] + 1)
    }
  }

  values.shift()

  return values.join(lineFeed)
}


/***/ }),

/***/ 7114:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unherit = __nccwpck_require__(6623)
var xtend = __nccwpck_require__(1208)
var Compiler = __nccwpck_require__(7751)

module.exports = stringify
stringify.Compiler = Compiler

function stringify(options) {
  var Local = unherit(Compiler)
  Local.prototype.options = xtend(
    Local.prototype.options,
    this.data('settings'),
    options
  )
  this.Compiler = Local
}


/***/ }),

/***/ 7751:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var toggle = __nccwpck_require__(6435)

module.exports = Compiler

// Construct a new compiler.
function Compiler(tree, file) {
  this.inLink = false
  this.inTable = false
  this.tree = tree
  this.file = file
  this.options = xtend(this.options)
  this.setOptions({})
}

var proto = Compiler.prototype

// Enter and exit helpers. */
proto.enterLink = toggle('inLink', false)
proto.enterTable = toggle('inTable', false)
proto.enterLinkReference = __nccwpck_require__(4416)

// Configuration.
proto.options = __nccwpck_require__(4325)
proto.setOptions = __nccwpck_require__(4605)

proto.compile = __nccwpck_require__(6437)
proto.visit = __nccwpck_require__(9036)
proto.all = __nccwpck_require__(1415)
proto.block = __nccwpck_require__(5269)
proto.visitOrderedItems = __nccwpck_require__(7346)
proto.visitUnorderedItems = __nccwpck_require__(7505)

// Expose visitors.
proto.visitors = {
  root: __nccwpck_require__(2631),
  text: __nccwpck_require__(966),
  heading: __nccwpck_require__(6870),
  paragraph: __nccwpck_require__(2296),
  blockquote: __nccwpck_require__(2737),
  list: __nccwpck_require__(9411),
  listItem: __nccwpck_require__(1910),
  inlineCode: __nccwpck_require__(1714),
  code: __nccwpck_require__(1602),
  html: __nccwpck_require__(380),
  thematicBreak: __nccwpck_require__(1852),
  strong: __nccwpck_require__(385),
  emphasis: __nccwpck_require__(3196),
  break: __nccwpck_require__(2609),
  delete: __nccwpck_require__(5576),
  link: __nccwpck_require__(9356),
  linkReference: __nccwpck_require__(8070),
  imageReference: __nccwpck_require__(5272),
  definition: __nccwpck_require__(9448),
  image: __nccwpck_require__(552),
  table: __nccwpck_require__(7244),
  tableCell: __nccwpck_require__(5200)
}


/***/ }),

/***/ 4325:
/***/ ((module) => {

"use strict";


module.exports = {
  gfm: true,
  commonmark: false,
  pedantic: false,
  entities: 'false',
  setext: false,
  closeAtx: false,
  tableCellPadding: true,
  tablePipeAlign: true,
  stringLength: stringLength,
  incrementListMarker: true,
  tightDefinitions: false,
  fences: false,
  fence: '`',
  bullet: '-',
  listItemIndent: 'tab',
  rule: '*',
  ruleSpaces: true,
  ruleRepetition: 3,
  strong: '*',
  emphasis: '_'
}

function stringLength(value) {
  return value.length
}


/***/ }),

/***/ 1795:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var decimal = __nccwpck_require__(5552)
var alphanumeric = __nccwpck_require__(3497)
var whitespace = __nccwpck_require__(8473)
var escapes = __nccwpck_require__(8805)
var prefix = __nccwpck_require__(7512)

module.exports = factory

var tab = '\t'
var lineFeed = '\n'
var space = ' '
var numberSign = '#'
var ampersand = '&'
var leftParenthesis = '('
var rightParenthesis = ')'
var asterisk = '*'
var plusSign = '+'
var dash = '-'
var dot = '.'
var colon = ':'
var lessThan = '<'
var greaterThan = '>'
var leftSquareBracket = '['
var backslash = '\\'
var rightSquareBracket = ']'
var underscore = '_'
var graveAccent = '`'
var verticalBar = '|'
var tilde = '~'
var exclamationMark = '!'

var entities = {
  '<': '&lt;',
  ':': '&#x3A;',
  '&': '&amp;',
  '|': '&#x7C;',
  '~': '&#x7E;'
}

var shortcut = 'shortcut'
var mailto = 'mailto'
var https = 'https'
var http = 'http'

var blankExpression = /\n\s*$/

// Factory to escape characters.
function factory(options) {
  return escape

  // Escape punctuation characters in a node’s value.
  function escape(value, node, parent) {
    var self = this
    var gfm = options.gfm
    var commonmark = options.commonmark
    var pedantic = options.pedantic
    var markers = commonmark ? [dot, rightParenthesis] : [dot]
    var siblings = parent && parent.children
    var index = siblings && siblings.indexOf(node)
    var previous = siblings && siblings[index - 1]
    var next = siblings && siblings[index + 1]
    var length = value.length
    var escapable = escapes(options)
    var position = -1
    var queue = []
    var escaped = queue
    var afterNewLine
    var character
    var wordCharBefore
    var wordCharAfter
    var offset
    var replace

    if (previous) {
      afterNewLine = text(previous) && blankExpression.test(previous.value)
    } else {
      afterNewLine =
        !parent || parent.type === 'root' || parent.type === 'paragraph'
    }

    while (++position < length) {
      character = value.charAt(position)
      replace = false

      if (character === '\n') {
        afterNewLine = true
      } else if (
        character === backslash ||
        character === graveAccent ||
        character === asterisk ||
        character === leftSquareBracket ||
        character === lessThan ||
        (character === ampersand && prefix(value.slice(position)) > 0) ||
        (character === rightSquareBracket && self.inLink) ||
        (gfm && character === tilde && value.charAt(position + 1) === tilde) ||
        (gfm &&
          character === verticalBar &&
          (self.inTable || alignment(value, position))) ||
        (character === underscore &&
          // Delegate leading/trailing underscores to the multinode version below.
          position > 0 &&
          position < length - 1 &&
          (pedantic ||
            !alphanumeric(value.charAt(position - 1)) ||
            !alphanumeric(value.charAt(position + 1)))) ||
        (gfm && !self.inLink && character === colon && protocol(queue.join('')))
      ) {
        replace = true
      } else if (afterNewLine) {
        if (
          character === greaterThan ||
          character === numberSign ||
          character === asterisk ||
          character === dash ||
          character === plusSign
        ) {
          replace = true
        } else if (decimal(character)) {
          offset = position + 1

          while (offset < length) {
            if (!decimal(value.charAt(offset))) {
              break
            }

            offset++
          }

          if (markers.indexOf(value.charAt(offset)) !== -1) {
            next = value.charAt(offset + 1)

            if (!next || next === space || next === tab || next === lineFeed) {
              queue.push(value.slice(position, offset))
              position = offset
              character = value.charAt(position)
              replace = true
            }
          }
        }
      }

      if (afterNewLine && !whitespace(character)) {
        afterNewLine = false
      }

      queue.push(replace ? one(character) : character)
    }

    // Multi-node versions.
    if (siblings && text(node)) {
      // Check for an opening parentheses after a link-reference (which can be
      // joined by white-space).
      if (previous && previous.referenceType === shortcut) {
        position = -1
        length = escaped.length

        while (++position < length) {
          character = escaped[position]

          if (character === space || character === tab) {
            continue
          }

          if (character === leftParenthesis || character === colon) {
            escaped[position] = one(character)
          }

          break
        }

        // If the current node is all spaces / tabs, preceded by a shortcut,
        // and followed by a text starting with `(`, escape it.
        if (
          text(next) &&
          position === length &&
          next.value.charAt(0) === leftParenthesis
        ) {
          escaped.push(backslash)
        }
      }

      // Ensure non-auto-links are not seen as links.  This pattern needs to
      // check the preceding nodes too.
      if (
        gfm &&
        !self.inLink &&
        text(previous) &&
        value.charAt(0) === colon &&
        protocol(previous.value.slice(-6))
      ) {
        escaped[0] = one(colon)
      }

      // Escape ampersand if it would otherwise start an entity.
      if (
        text(next) &&
        value.charAt(length - 1) === ampersand &&
        prefix(ampersand + next.value) !== 0
      ) {
        escaped[escaped.length - 1] = one(ampersand)
      }

      // Escape exclamation marks immediately followed by links.
      if (
        next &&
        next.type === 'link' &&
        value.charAt(length - 1) === exclamationMark
      ) {
        escaped[escaped.length - 1] = one(exclamationMark)
      }

      // Escape double tildes in GFM.
      if (
        gfm &&
        text(next) &&
        value.charAt(length - 1) === tilde &&
        next.value.charAt(0) === tilde
      ) {
        escaped.splice(-1, 0, backslash)
      }

      // Escape underscores, but not mid-word (unless in pedantic mode).
      wordCharBefore = text(previous) && alphanumeric(previous.value.slice(-1))
      wordCharAfter = text(next) && alphanumeric(next.value.charAt(0))

      if (length === 1) {
        if (
          value === underscore &&
          (pedantic || !wordCharBefore || !wordCharAfter)
        ) {
          escaped.unshift(backslash)
        }
      } else {
        if (
          value.charAt(0) === underscore &&
          (pedantic || !wordCharBefore || !alphanumeric(value.charAt(1)))
        ) {
          escaped.unshift(backslash)
        }

        if (
          value.charAt(length - 1) === underscore &&
          (pedantic ||
            !wordCharAfter ||
            !alphanumeric(value.charAt(length - 2)))
        ) {
          escaped.splice(-1, 0, backslash)
        }
      }
    }

    return escaped.join('')

    function one(character) {
      return escapable.indexOf(character) === -1
        ? entities[character]
        : backslash + character
    }
  }
}

// Check if `index` in `value` is inside an alignment row.
function alignment(value, index) {
  var start = value.lastIndexOf(lineFeed, index)
  var end = value.indexOf(lineFeed, index)
  var char

  end = end === -1 ? value.length : end

  while (++start < end) {
    char = value.charAt(start)

    if (
      char !== colon &&
      char !== dash &&
      char !== space &&
      char !== verticalBar
    ) {
      return false
    }
  }

  return true
}

// Check if `node` is a text node.
function text(node) {
  return node && node.type === 'text'
}

// Check if `value` ends in a protocol.
function protocol(value) {
  var tail = value.slice(-6).toLowerCase()
  return tail === mailto || tail.slice(-5) === https || tail.slice(-4) === http
}


/***/ }),

/***/ 1415:
/***/ ((module) => {

"use strict";


module.exports = all

// Visit all children of `parent`.
function all(parent) {
  var self = this
  var children = parent.children
  var length = children.length
  var results = []
  var index = -1

  while (++index < length) {
    results[index] = self.visit(children[index], parent)
  }

  return results
}


/***/ }),

/***/ 5269:
/***/ ((module) => {

"use strict";


module.exports = block

var lineFeed = '\n'

var blank = lineFeed + lineFeed
var triple = blank + lineFeed
var comment = blank + '<!---->' + blank

// Stringify a block node with block children (e.g., `root` or `blockquote`).
// Knows about code following a list, or adjacent lists with similar bullets,
// and places an extra line feed between them.
function block(node) {
  var self = this
  var options = self.options
  var fences = options.fences
  var gap = options.commonmark ? comment : triple
  var definitionGap = options.tightDefinitions ? lineFeed : blank
  var values = []
  var children = node.children
  var length = children.length
  var index = -1
  var previous
  var child

  while (++index < length) {
    previous = child
    child = children[index]

    if (previous) {
      // A list preceding another list that are equally ordered, or a
      // list preceding an indented code block, need a gap between them,
      // so as not to see them as one list, or content of the list,
      // respectively.
      //
      // In commonmark, only something that breaks both up can do that,
      // so we opt for an empty, invisible comment.  In other flavours,
      // two blank lines are fine.
      if (
        previous.type === 'list' &&
        ((child.type === 'list' && previous.ordered === child.ordered) ||
          (child.type === 'code' && !child.lang && !fences))
      ) {
        values.push(gap)
      } else if (
        previous.type === 'definition' &&
        child.type === 'definition'
      ) {
        values.push(definitionGap)
      } else {
        values.push(blank)
      }
    }

    values.push(self.visit(child, node))
  }

  return values.join('')
}


/***/ }),

/***/ 6437:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var compact = __nccwpck_require__(679)

module.exports = compile

// Stringify the given tree.
function compile() {
  return this.visit(compact(this.tree, this.options.commonmark))
}


/***/ }),

/***/ 9036:
/***/ ((module) => {

"use strict";


module.exports = one

function one(node, parent) {
  var self = this
  var visitors = self.visitors

  // Fail on unknown nodes.
  if (typeof visitors[node.type] !== 'function') {
    self.file.fail(
      new Error(
        'Missing compiler for node of type `' + node.type + '`: `' + node + '`'
      ),
      node
    )
  }

  return visitors[node.type].call(self, node, parent)
}


/***/ }),

/***/ 7346:
/***/ ((module) => {

"use strict";


module.exports = orderedItems

var lineFeed = '\n'
var dot = '.'

var blank = lineFeed + lineFeed

// Visit ordered list items.
//
// Starts the list with
// `node.start` and increments each following list item
// bullet by one:
//
//     2. foo
//     3. bar
//
// In `incrementListMarker: false` mode, does not increment
// each marker and stays on `node.start`:
//
//     1. foo
//     1. bar
function orderedItems(node) {
  var self = this
  var fn = self.visitors.listItem
  var increment = self.options.incrementListMarker
  var values = []
  var start = node.start
  var children = node.children
  var length = children.length
  var index = -1
  var bullet

  start = start == null ? 1 : start

  while (++index < length) {
    bullet = (increment ? start + index : start) + dot
    values[index] = fn.call(self, children[index], node, index, bullet)
  }

  return values.join(node.spread ? blank : lineFeed)
}


/***/ }),

/***/ 7505:
/***/ ((module) => {

"use strict";


module.exports = unorderedItems

var lineFeed = '\n'

var blank = lineFeed + lineFeed

// Visit unordered list items.  Uses `options.bullet` as each item’s bullet.
function unorderedItems(node) {
  var self = this
  var bullet = self.options.bullet
  var fn = self.visitors.listItem
  var children = node.children
  var length = children.length
  var index = -1
  var values = []

  while (++index < length) {
    values[index] = fn.call(self, children[index], node, index, bullet)
  }

  return values.join(node.spread ? blank : lineFeed)
}


/***/ }),

/***/ 4605:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var encode = __nccwpck_require__(704)
var defaults = __nccwpck_require__(4325)
var escapeFactory = __nccwpck_require__(1795)
var identity = __nccwpck_require__(4320)

module.exports = setOptions

// Map of applicable enums.
var maps = {
  entities: {true: true, false: true, numbers: true, escape: true},
  bullet: {'*': true, '-': true, '+': true},
  rule: {'-': true, _: true, '*': true},
  listItemIndent: {tab: true, mixed: true, 1: true},
  emphasis: {_: true, '*': true},
  strong: {_: true, '*': true},
  fence: {'`': true, '~': true}
}

// Expose `validate`.
var validate = {
  boolean: validateBoolean,
  string: validateString,
  number: validateNumber,
  function: validateFunction
}

// Set options.  Does not overwrite previously set options.
function setOptions(options) {
  var self = this
  var current = self.options
  var ruleRepetition
  var key

  if (options == null) {
    options = {}
  } else if (typeof options === 'object') {
    options = xtend(options)
  } else {
    throw new Error('Invalid value `' + options + '` for setting `options`')
  }

  for (key in defaults) {
    validate[typeof defaults[key]](options, key, current[key], maps[key])
  }

  ruleRepetition = options.ruleRepetition

  if (ruleRepetition && ruleRepetition < 3) {
    raise(ruleRepetition, 'options.ruleRepetition')
  }

  self.encode = encodeFactory(String(options.entities))
  self.escape = escapeFactory(options)

  self.options = options

  return self
}

// Validate a value to be boolean. Defaults to `def`.  Raises an exception with
// `context[name]` when not a boolean.
function validateBoolean(context, name, def) {
  var value = context[name]

  if (value == null) {
    value = def
  }

  if (typeof value !== 'boolean') {
    raise(value, 'options.' + name)
  }

  context[name] = value
}

// Validate a value to be boolean. Defaults to `def`.  Raises an exception with
// `context[name]` when not a boolean.
function validateNumber(context, name, def) {
  var value = context[name]

  if (value == null) {
    value = def
  }

  if (isNaN(value)) {
    raise(value, 'options.' + name)
  }

  context[name] = value
}

// Validate a value to be in `map`. Defaults to `def`.  Raises an exception
// with `context[name]` when not in `map`.
function validateString(context, name, def, map) {
  var value = context[name]

  if (value == null) {
    value = def
  }

  value = String(value)

  if (!(value in map)) {
    raise(value, 'options.' + name)
  }

  context[name] = value
}

// Validate a value to be function. Defaults to `def`.  Raises an exception
// with `context[name]` when not a function.
function validateFunction(context, name, def) {
  var value = context[name]

  if (value == null) {
    value = def
  }

  if (typeof value !== 'function') {
    raise(value, 'options.' + name)
  }

  context[name] = value
}

// Factory to encode HTML entities.  Creates a no-operation function when
// `type` is `'false'`, a function which encodes using named references when
// `type` is `'true'`, and a function which encodes using numbered references
// when `type` is `'numbers'`.
function encodeFactory(type) {
  var options = {}

  if (type === 'false') {
    return identity
  }

  if (type === 'true') {
    options.useNamedReferences = true
  }

  if (type === 'escape') {
    options.escapeOnly = true
    options.useNamedReferences = true
  }

  return wrapped

  // Encode HTML entities using the bound options.
  function wrapped(value) {
    return encode(value, options)
  }
}

// Throw an exception with in its `message` `value` and `name`.
function raise(value, name) {
  throw new Error('Invalid value `' + value + '` for setting `' + name + '`')
}


/***/ }),

/***/ 3275:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var entityPrefixLength = __nccwpck_require__(7512)

module.exports = copy

var ampersand = '&'

var punctuationExppresion = /[-!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~_]/

// For shortcut and collapsed reference links, the contents is also an
// identifier, so we need to restore the original encoding and escaping
// that were present in the source string.
//
// This function takes the unescaped & unencoded value from shortcut’s
// child nodes and the identifier and encodes the former according to
// the latter.
function copy(value, identifier) {
  var length = value.length
  var count = identifier.length
  var result = []
  var position = 0
  var index = 0
  var start

  while (index < length) {
    // Take next non-punctuation characters from `value`.
    start = index

    while (index < length && !punctuationExppresion.test(value.charAt(index))) {
      index += 1
    }

    result.push(value.slice(start, index))

    // Advance `position` to the next punctuation character.
    while (
      position < count &&
      !punctuationExppresion.test(identifier.charAt(position))
    ) {
      position += 1
    }

    // Take next punctuation characters from `identifier`.
    start = position

    while (
      position < count &&
      punctuationExppresion.test(identifier.charAt(position))
    ) {
      if (identifier.charAt(position) === ampersand) {
        position += entityPrefixLength(identifier.slice(position))
      }

      position += 1
    }

    result.push(identifier.slice(start, position))

    // Advance `index` to the next non-punctuation character.
    while (index < length && punctuationExppresion.test(value.charAt(index))) {
      index += 1
    }
  }

  return result.join('')
}


/***/ }),

/***/ 8214:
/***/ ((module) => {

"use strict";


module.exports = enclose

var quotationMark = '"'
var apostrophe = "'"

// There is currently no way to support nested delimiters across Markdown.pl,
// CommonMark, and GitHub (RedCarpet).  The following code supports Markdown.pl
// and GitHub.
// CommonMark is not supported when mixing double- and single quotes inside a
// title.
function enclose(title) {
  var delimiter =
    title.indexOf(quotationMark) === -1 ? quotationMark : apostrophe
  return delimiter + title + delimiter
}


/***/ }),

/***/ 6550:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var count = __nccwpck_require__(1291)

module.exports = enclose

var leftParenthesis = '('
var rightParenthesis = ')'
var lessThan = '<'
var greaterThan = '>'

var expression = /\s/

// Wrap `url` in angle brackets when needed, or when
// forced.
// In links, images, and definitions, the URL part needs
// to be enclosed when it:
//
// - has a length of `0`
// - contains white-space
// - has more or less opening than closing parentheses
function enclose(uri, always) {
  if (
    always ||
    uri.length === 0 ||
    expression.test(uri) ||
    count(uri, leftParenthesis) !== count(uri, rightParenthesis)
  ) {
    return lessThan + uri + greaterThan
  }

  return uri
}


/***/ }),

/***/ 4416:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var identity = __nccwpck_require__(4320)

module.exports = enter

// Shortcut and collapsed link references need no escaping and encoding during
// the processing of child nodes (it must be implied from identifier).
//
// This toggler turns encoding and escaping off for shortcut and collapsed
// references.
//
// Implies `enterLink`.
function enter(compiler, node) {
  var encode = compiler.encode
  var escape = compiler.escape
  var exitLink = compiler.enterLink()

  if (node.referenceType !== 'shortcut' && node.referenceType !== 'collapsed') {
    return exitLink
  }

  compiler.escape = identity
  compiler.encode = identity

  return exit

  function exit() {
    compiler.encode = encode
    compiler.escape = escape
    exitLink()
  }
}


/***/ }),

/***/ 7512:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var decode = __nccwpck_require__(8859)

module.exports = length

var ampersand = '&'

// Returns the length of HTML entity that is a prefix of the given string
// (excluding the ampersand), 0 if it does not start with an entity.
function length(value) {
  var prefix

  /* istanbul ignore if - Currently also tested for at implemention, but we
   * keep it here because that’s proper. */
  if (value.charAt(0) !== ampersand) {
    return 0
  }

  prefix = value.split(ampersand, 2).join(ampersand)

  return prefix.length - decode(prefix).length
}


/***/ }),

/***/ 4320:
/***/ ((module) => {

"use strict";


module.exports = identity

function identity(value) {
  return value
}


/***/ }),

/***/ 8839:
/***/ ((module) => {

"use strict";


module.exports = label

var leftSquareBracket = '['
var rightSquareBracket = ']'

var shortcut = 'shortcut'
var collapsed = 'collapsed'

// Stringify a reference label.
// Because link references are easily, mistakingly, created (for example,
// `[foo]`), reference nodes have an extra property depicting how it looked in
// the original document, so stringification can cause minimal changes.
function label(node) {
  var type = node.referenceType

  if (type === shortcut) {
    return ''
  }

  return (
    leftSquareBracket +
    (type === collapsed ? '' : node.label || node.identifier) +
    rightSquareBracket
  )
}


/***/ }),

/***/ 5831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)

module.exports = pad

var lineFeed = '\n'
var space = ' '

var tabSize = 4

// Pad `value` with `level * tabSize` spaces.  Respects lines.  Ignores empty
// lines.
function pad(value, level) {
  var values = value.split(lineFeed)
  var index = values.length
  var padding = repeat(space, level * tabSize)

  while (index--) {
    if (values[index].length !== 0) {
      values[index] = padding + values[index]
    }
  }

  return values.join(lineFeed)
}


/***/ }),

/***/ 2737:
/***/ ((module) => {

"use strict";


module.exports = blockquote

var lineFeed = '\n'
var space = ' '
var greaterThan = '>'

function blockquote(node) {
  var values = this.block(node).split(lineFeed)
  var result = []
  var length = values.length
  var index = -1
  var value

  while (++index < length) {
    value = values[index]
    result[index] = (value ? space : '') + value
  }

  return greaterThan + result.join(lineFeed + greaterThan)
}


/***/ }),

/***/ 2609:
/***/ ((module) => {

"use strict";


module.exports = lineBreak

var backslash = '\\'
var lineFeed = '\n'
var space = ' '

var commonmark = backslash + lineFeed
var normal = space + space + lineFeed

function lineBreak() {
  return this.options.commonmark ? commonmark : normal
}


/***/ }),

/***/ 1602:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var streak = __nccwpck_require__(4232)
var repeat = __nccwpck_require__(6976)
var pad = __nccwpck_require__(5831)

module.exports = code

var lineFeed = '\n'
var space = ' '
var tilde = '~'
var graveAccent = '`'

// Stringify code.
// Creates indented code when:
//
// - No language tag exists
// - Not in `fences: true` mode
// - A non-empty value exists
//
// Otherwise, GFM fenced code is created:
//
// ````markdown
// ```js
// foo();
// ```
// ````
//
// When in ``fence: `~` `` mode, uses tildes as fences:
//
// ```markdown
// ~~~js
// foo();
// ~~~
// ```
//
// Knows about internal fences:
//
// `````markdown
// ````markdown
// ```javascript
// foo();
// ```
// ````
// `````
function code(node, parent) {
  var self = this
  var value = node.value
  var options = self.options
  var marker = options.fence
  var info = node.lang || ''
  var fence

  if (info && node.meta) {
    info += space + node.meta
  }

  info = self.encode(self.escape(info, node))

  // Without (needed) fences.
  if (
    !info &&
    !options.fences &&
    value &&
    value.charAt(0) !== lineFeed &&
    value.charAt(value.length - 1) !== lineFeed
  ) {
    // Throw when pedantic, in a list item which isn’t compiled using a tab.
    if (
      parent &&
      parent.type === 'listItem' &&
      options.listItemIndent !== 'tab' &&
      options.pedantic
    ) {
      self.file.fail(
        'Cannot indent code properly. See https://git.io/fxKR8',
        node.position
      )
    }

    return pad(value, 1)
  }

  // Backticks in the info string don’t work with backtick fenced code.
  // Backticks (and tildes) are fine in tilde fenced code.
  if (marker === graveAccent && info.indexOf(graveAccent) !== -1) {
    marker = tilde
  }

  fence = repeat(marker, Math.max(streak(value, marker) + 1, 3))

  return fence + info + lineFeed + value + lineFeed + fence
}


/***/ }),

/***/ 9448:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var uri = __nccwpck_require__(6550)
var title = __nccwpck_require__(8214)

module.exports = definition

var space = ' '
var colon = ':'
var leftSquareBracket = '['
var rightSquareBracket = ']'

// Stringify an URL definition.
//
// Is smart about enclosing `url` (see `encloseURI()`) and `title` (see
// `encloseTitle()`).
//
// ```markdown
// [foo]: <foo at bar dot com> 'An "example" e-mail'
// ```
function definition(node) {
  var content = uri(node.url)

  if (node.title) {
    content += space + title(node.title)
  }

  return (
    leftSquareBracket +
    (node.label || node.identifier) +
    rightSquareBracket +
    colon +
    space +
    content
  )
}


/***/ }),

/***/ 5576:
/***/ ((module) => {

"use strict";


module.exports = strikethrough

var tilde = '~'

var fence = tilde + tilde

function strikethrough(node) {
  return fence + this.all(node).join('') + fence
}


/***/ }),

/***/ 3196:
/***/ ((module) => {

"use strict";


module.exports = emphasis

var underscore = '_'
var asterisk = '*'

// Stringify an `emphasis`.
//
// The marker used is configurable through `emphasis`, which defaults to an
// underscore (`'_'`) but also accepts an asterisk (`'*'`):
//
// ```markdown
// *foo*
// ```
//
// In `pedantic` mode, text which itself contains an underscore will cause the
// marker to default to an asterisk instead:
//
// ```markdown
// *foo_bar*
// ```
function emphasis(node) {
  var marker = this.options.emphasis
  var content = this.all(node).join('')

  // When in pedantic mode, prevent using underscore as the marker when there
  // are underscores in the content.
  if (
    this.options.pedantic &&
    marker === underscore &&
    content.indexOf(marker) !== -1
  ) {
    marker = asterisk
  }

  return marker + content + marker
}


/***/ }),

/***/ 6870:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)

module.exports = heading

var lineFeed = '\n'
var space = ' '
var numberSign = '#'
var dash = '-'
var equalsTo = '='

// Stringify a heading.
//
// In `setext: true` mode and when `depth` is smaller than three, creates a
// setext header:
//
// ```markdown
// Foo
// ===
// ```
//
// Otherwise, an ATX header is generated:
//
// ```markdown
// ### Foo
// ```
//
// In `closeAtx: true` mode, the header is closed with hashes:
//
// ```markdown
// ### Foo ###
// ```
function heading(node) {
  var self = this
  var depth = node.depth
  var setext = self.options.setext
  var closeAtx = self.options.closeAtx
  var content = self.all(node).join('')
  var prefix

  if (setext && depth < 3) {
    return (
      content + lineFeed + repeat(depth === 1 ? equalsTo : dash, content.length)
    )
  }

  prefix = repeat(numberSign, node.depth)

  return prefix + space + content + (closeAtx ? space + prefix : '')
}


/***/ }),

/***/ 380:
/***/ ((module) => {

"use strict";


module.exports = html

function html(node) {
  return node.value
}


/***/ }),

/***/ 5272:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var label = __nccwpck_require__(8839)

module.exports = imageReference

var leftSquareBracket = '['
var rightSquareBracket = ']'
var exclamationMark = '!'

function imageReference(node) {
  return (
    exclamationMark +
    leftSquareBracket +
    (this.encode(node.alt, node) || '') +
    rightSquareBracket +
    label(node)
  )
}


/***/ }),

/***/ 552:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var uri = __nccwpck_require__(6550)
var title = __nccwpck_require__(8214)

module.exports = image

var space = ' '
var leftParenthesis = '('
var rightParenthesis = ')'
var leftSquareBracket = '['
var rightSquareBracket = ']'
var exclamationMark = '!'

// Stringify an image.
//
// Is smart about enclosing `url` (see `encloseURI()`) and `title` (see
// `encloseTitle()`).
//
// ```markdown
// ![foo](</fav icon.png> 'My "favourite" icon')
// ```
//
// Supports named entities in `url`, `alt`, and `title` when in
// `settings.encode` mode.
function image(node) {
  var self = this
  var content = uri(self.encode(node.url || '', node))
  var exit = self.enterLink()
  var alt = self.encode(self.escape(node.alt || '', node))

  exit()

  if (node.title) {
    content += space + title(self.encode(node.title, node))
  }

  return (
    exclamationMark +
    leftSquareBracket +
    alt +
    rightSquareBracket +
    leftParenthesis +
    content +
    rightParenthesis
  )
}


/***/ }),

/***/ 1714:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var streak = __nccwpck_require__(4232)
var repeat = __nccwpck_require__(6976)

module.exports = inlineCode

var graveAccentChar = '`'
var lineFeed = 10 //  '\n'
var space = 32 // ' '
var graveAccent = 96 //  '`'

// Stringify inline code.
//
// Knows about internal ticks (`\``), and ensures one more tick is used to
// enclose the inline code:
//
// ````markdown
// ```foo ``bar`` baz```
// ````
//
// Even knows about inital and final ticks:
//
// ``markdown
// `` `foo ``
// `` foo` ``
// ```
function inlineCode(node) {
  var value = node.value
  var ticks = repeat(graveAccentChar, streak(value, graveAccentChar) + 1)
  var start = ticks
  var end = ticks
  var head = value.charCodeAt(0)
  var tail = value.charCodeAt(value.length - 1)
  var wrap = false
  var index
  var length

  if (head === graveAccent || tail === graveAccent) {
    wrap = true
  } else if (value.length > 2 && ws(head) && ws(tail)) {
    index = 1
    length = value.length - 1

    while (++index < length) {
      if (!ws(value.charCodeAt(index))) {
        wrap = true
        break
      }
    }
  }

  if (wrap) {
    start += ' '
    end = ' ' + end
  }

  return start + value + end
}

function ws(code) {
  return code === lineFeed || code === space
}


/***/ }),

/***/ 8070:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var copy = __nccwpck_require__(3275)
var label = __nccwpck_require__(8839)

module.exports = linkReference

var leftSquareBracket = '['
var rightSquareBracket = ']'

var shortcut = 'shortcut'
var collapsed = 'collapsed'

function linkReference(node) {
  var self = this
  var type = node.referenceType
  var exit = self.enterLinkReference(self, node)
  var value = self.all(node).join('')

  exit()

  if (type === shortcut || type === collapsed) {
    value = copy(value, node.label || node.identifier)
  }

  return leftSquareBracket + value + rightSquareBracket + label(node)
}


/***/ }),

/***/ 9356:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var uri = __nccwpck_require__(6550)
var title = __nccwpck_require__(8214)

module.exports = link

var space = ' '
var leftSquareBracket = '['
var rightSquareBracket = ']'
var leftParenthesis = '('
var rightParenthesis = ')'

// Expression for a protocol:
// See <https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Generic_syntax>.
var protocol = /^[a-z][a-z+.-]+:\/?/i

// Stringify a link.
//
// When no title exists, the compiled `children` equal `url`, and `url` starts
// with a protocol, an auto link is created:
//
// ```markdown
// <http://example.com>
// ```
//
// Otherwise, is smart about enclosing `url` (see `encloseURI()`) and `title`
// (see `encloseTitle()`).
// ```
//
// ```markdown
// [foo](<foo at bar dot com> 'An "example" e-mail')
// ```
//
// Supports named entities in the `url` and `title` when in `settings.encode`
// mode.
function link(node) {
  var self = this
  var content = self.encode(node.url || '', node)
  var exit = self.enterLink()
  var escaped = self.encode(self.escape(node.url || '', node))
  var value = self.all(node).join('')

  exit()

  if (node.title == null && protocol.test(content) && escaped === value) {
    // Backslash escapes do not work in autolinks, so we do not escape.
    return uri(self.encode(node.url), true)
  }

  content = uri(content)

  if (node.title) {
    content += space + title(self.encode(self.escape(node.title, node), node))
  }

  return (
    leftSquareBracket +
    value +
    rightSquareBracket +
    leftParenthesis +
    content +
    rightParenthesis
  )
}


/***/ }),

/***/ 1910:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)
var pad = __nccwpck_require__(5831)

module.exports = listItem

var lineFeed = '\n'
var space = ' '
var leftSquareBracket = '['
var rightSquareBracket = ']'
var lowercaseX = 'x'

var ceil = Math.ceil
var blank = lineFeed + lineFeed

var tabSize = 4

// Stringify a list item.
//
// Prefixes the content with a checked checkbox when `checked: true`:
//
// ```markdown
// [x] foo
// ```
//
// Prefixes the content with an unchecked checkbox when `checked: false`:
//
// ```markdown
// [ ] foo
// ```
function listItem(node, parent, position, bullet) {
  var self = this
  var style = self.options.listItemIndent
  var marker = bullet || self.options.bullet
  var spread = node.spread == null ? true : node.spread
  var checked = node.checked
  var children = node.children
  var length = children.length
  var values = []
  var index = -1
  var value
  var indent
  var spacing

  while (++index < length) {
    values[index] = self.visit(children[index], node)
  }

  value = values.join(spread ? blank : lineFeed)

  if (typeof checked === 'boolean') {
    // Note: I’d like to be able to only add the space between the check and
    // the value, but unfortunately github does not support empty list-items
    // with a checkbox :(
    value =
      leftSquareBracket +
      (checked ? lowercaseX : space) +
      rightSquareBracket +
      space +
      value
  }

  if (style === '1' || (style === 'mixed' && value.indexOf(lineFeed) === -1)) {
    indent = marker.length + 1
    spacing = space
  } else {
    indent = ceil((marker.length + 1) / tabSize) * tabSize
    spacing = repeat(space, indent - marker.length)
  }

  return value
    ? marker + spacing + pad(value, indent / tabSize).slice(indent)
    : marker
}


/***/ }),

/***/ 9411:
/***/ ((module) => {

"use strict";


module.exports = list

function list(node) {
  var fn = node.ordered ? this.visitOrderedItems : this.visitUnorderedItems
  return fn.call(this, node)
}


/***/ }),

/***/ 2296:
/***/ ((module) => {

"use strict";


module.exports = paragraph

function paragraph(node) {
  return this.all(node).join('')
}


/***/ }),

/***/ 2631:
/***/ ((module) => {

"use strict";


module.exports = root

var lineFeed = '\n'

// Stringify a root.
// Adds a final newline to ensure valid POSIX files. */
function root(node) {
  var doc = this.block(node)

  if (doc.charAt(doc.length - 1) !== lineFeed) {
    doc += lineFeed
  }

  return doc
}


/***/ }),

/***/ 385:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)

module.exports = strong

// Stringify a `strong`.
//
// The marker used is configurable by `strong`, which defaults to an asterisk
// (`'*'`) but also accepts an underscore (`'_'`):
//
// ```markdown
// __foo__
// ```
function strong(node) {
  var marker = repeat(this.options.strong, 2)
  return marker + this.all(node).join('') + marker
}


/***/ }),

/***/ 5200:
/***/ ((module) => {

"use strict";


module.exports = tableCell

var lineFeed = /\r?\n/g

function tableCell(node) {
  return this.all(node).join('').replace(lineFeed, ' ')
}


/***/ }),

/***/ 7244:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var markdownTable = __nccwpck_require__(1062)

module.exports = table

// Stringify table.
//
// Creates a fenced table.
// The table has aligned delimiters by default, but not in
// `tablePipeAlign: false`:
//
// ```markdown
// | Header 1 | Header 2 |
// | :-: | - |
// | Alpha | Bravo |
// ```
//
// The table is spaced by default, but not in `tableCellPadding: false`:
//
// ```markdown
// |Foo|Bar|
// |:-:|---|
// |Baz|Qux|
// ```
function table(node) {
  var self = this
  var options = self.options
  var padding = options.tableCellPadding
  var alignDelimiters = options.tablePipeAlign
  var stringLength = options.stringLength
  var rows = node.children
  var index = rows.length
  var exit = self.enterTable()
  var result = []

  while (index--) {
    result[index] = self.all(rows[index])
  }

  exit()

  return markdownTable(result, {
    align: node.align,
    alignDelimiters: alignDelimiters,
    padding: padding,
    stringLength: stringLength
  })
}


/***/ }),

/***/ 966:
/***/ ((module) => {

"use strict";


module.exports = text

// Stringify text.
// Supports named entities in `settings.encode: true` mode:
//
// ```markdown
// AT&amp;T
// ```
//
// Supports numbered entities in `settings.encode: numbers` mode:
//
// ```markdown
// AT&#x26;T
// ```
function text(node, parent) {
  return this.encode(this.escape(node.value, node, parent), node)
}


/***/ }),

/***/ 1852:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var repeat = __nccwpck_require__(6976)

module.exports = thematic

var space = ' '

// Stringify a `thematic-break`.
// The character used is configurable through `rule`: (`'_'`):
//
// ```markdown
// ___
// ```
//
// The number of repititions is defined through `ruleRepetition` (`6`):
//
// ```markdown
// ******
// ```
//
// Whether spaces delimit each character, is configured through `ruleSpaces`
// (`true`):
// ```markdown
// * * *
// ```
function thematic() {
  var options = this.options
  var rule = repeat(options.rule, options.ruleRepetition)
  return options.ruleSpaces ? rule.split('').join(space) : rule
}


/***/ }),

/***/ 2081:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unified = __nccwpck_require__(5075)
var parse = __nccwpck_require__(4859)
var stringify = __nccwpck_require__(7114)

module.exports = unified().use(parse).use(stringify).freeze()


/***/ }),

/***/ 6976:
/***/ ((module) => {

"use strict";
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

module.exports = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}


/***/ }),

/***/ 6435:
/***/ ((module) => {

"use strict";


module.exports = factory

// Construct a state `toggler`: a function which inverses `property` in context
// based on its current value.
// The by `toggler` returned function restores that value.
function factory(key, state, ctx) {
  return enter

  function enter() {
    var context = ctx || this
    var current = context[key]

    context[key] = !state

    return exit

    function exit() {
      context[key] = current
    }
  }
}


/***/ }),

/***/ 704:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(6715)


/***/ }),

/***/ 1956:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var entities = __nccwpck_require__(8348)

var characters = {}
var name

module.exports = characters

for (name in entities) {
  characters[entities[name]] = name
}


/***/ }),

/***/ 2591:
/***/ ((module) => {

module.exports = String.fromCharCode


/***/ }),

/***/ 6454:
/***/ ((module) => {

module.exports = {}.hasOwnProperty


/***/ }),

/***/ 555:
/***/ ((module) => {

"use strict";


module.exports = encode

// Encode special characters in `value`.
function encode(value, options) {
  value = value.replace(
    options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g,
    basic
  )

  if (options.subset || options.escapeOnly) {
    return value
  }

  return (
    value
      // Surrogate pairs.
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate)
      // BMP control characters (C0 except for LF, CR, SP; DEL; and some more
      // non-ASCII ones).
      .replace(
        // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
        /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
        basic
      )
  )

  function surrogate(pair, index, all) {
    return options.format(
      (pair.charCodeAt(0) - 0xd800) * 0x400 +
        pair.charCodeAt(1) -
        0xdc00 +
        0x10000,
      all.charCodeAt(index + 2),
      options
    )
  }

  function basic(character, index, all) {
    return options.format(
      character.charCodeAt(0),
      all.charCodeAt(index + 1),
      options
    )
  }
}

function charactersToExpression(subset) {
  var groups = []
  var index = -1

  while (++index < subset.length) {
    groups.push(subset[index].replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'))
  }

  return new RegExp('(?:' + groups.join('|') + ')', 'g')
}


/***/ }),

/***/ 6282:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var core = __nccwpck_require__(555)
var smart = __nccwpck_require__(5883)

module.exports = encode

// Encode special characters in `value`.
function encode(value, options) {
  // Note: Switch to `Object.assign` next major.
  return core(value, xtend(options, {format: smart}))
}


/***/ }),

/***/ 3448:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var core = __nccwpck_require__(555)
var smart = __nccwpck_require__(5883)

module.exports = escape

// Shortcut to escape special characters in HTML.
function escape(value) {
  return core(value, {
    escapeOnly: true,
    useNamedReferences: true,
    format: smart
  })
}


/***/ }),

/***/ 6715:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var encode = __nccwpck_require__(6282)
var escape = __nccwpck_require__(3448)

module.exports = encode
encode.escape = escape


/***/ }),

/***/ 5883:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = formatPretty

var toHexadecimal = __nccwpck_require__(4528)
var toDecimal = __nccwpck_require__(4890)
var toNamed = __nccwpck_require__(9273)

// Encode `character` according to `options`.
function formatPretty(code, next, options) {
  var named
  var numeric
  var decimal

  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code,
      next,
      options.omitOptionalSemicolons,
      options.attribute
    )
  }

  if (options.useShortestReferences || !named) {
    numeric = toHexadecimal(code, next, options.omitOptionalSemicolons)

    // Use the shortest numeric reference when requested.
    // A simple algorithm would use decimal for all code points under 100, as
    // those are shorter than hexadecimal:
    //
    // * `&#99;` vs `&#x63;` (decimal shorter)
    // * `&#100;` vs `&#x64;` (equal)
    //
    // However, because we take `next` into consideration when `omit` is used,
    // And it would be possible that decimals are shorter on bigger values as
    // well if `next` is hexadecimal but not decimal, we instead compare both.
    if (options.useShortestReferences) {
      decimal = toDecimal(code, next, options.omitOptionalSemicolons)

      if (decimal.length < numeric.length) {
        numeric = decimal
      }
    }
  }

  return named &&
    (!options.useShortestReferences || named.length < numeric.length)
    ? named
    : numeric
}


/***/ }),

/***/ 4890:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = toDecimalReference

var fromCharCode = __nccwpck_require__(2591)

// Transform `code` into a decimal character reference.
function toDecimalReference(code, next, omit) {
  var value = '&#' + String(code)
  return omit && next && !/\d/.test(fromCharCode(next)) ? value : value + ';'
}


/***/ }),

/***/ 4528:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = toHexReference

var fromCharCode = __nccwpck_require__(2591)

// Transform `code` into a hexadecimal character reference.
function toHexReference(code, next, omit) {
  var value = '&#x' + code.toString(16).toUpperCase()
  return omit && next && !/[\dA-Fa-f]/.test(fromCharCode(next))
    ? value
    : value + ';'
}


/***/ }),

/***/ 9273:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = toNamed

var legacy = __nccwpck_require__(7452)
var characters = __nccwpck_require__(1956)
var fromCharCode = __nccwpck_require__(2591)
var own = __nccwpck_require__(6454)
var dangerous = __nccwpck_require__(2930)

// Transform `code` into a named character reference.
function toNamed(code, next, omit, attribute) {
  var character = fromCharCode(code)
  var name
  var value

  if (own.call(characters, character)) {
    name = characters[character]
    value = '&' + name

    if (
      omit &&
      own.call(legacy, name) &&
      dangerous.indexOf(name) === -1 &&
      (!attribute ||
        (next && next !== 61 /* `=` */ && /[^\da-z]/i.test(fromCharCode(next))))
    ) {
      return value
    }

    return value + ';'
  }

  return ''
}


/***/ }),

/***/ 3199:
/***/ ((module) => {

"use strict";


module.exports = trimTrailingLines

// Remove final newline characters from `value`.
function trimTrailingLines(value) {
  return String(value).replace(/\n+$/, '')
}


/***/ }),

/***/ 4065:
/***/ ((module, exports) => {


exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};


/***/ }),

/***/ 3604:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var wrap = __nccwpck_require__(3458)

module.exports = trough

trough.wrap = wrap

var slice = [].slice

// Create new middleware.
function trough() {
  var fns = []
  var middleware = {}

  middleware.run = run
  middleware.use = use

  return middleware

  // Run `fns`.  Last argument must be a completion handler.
  function run() {
    var index = -1
    var input = slice.call(arguments, 0, -1)
    var done = arguments[arguments.length - 1]

    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done)
    }

    next.apply(null, [null].concat(input))

    // Run the next `fn`, if any.
    function next(err) {
      var fn = fns[++index]
      var params = slice.call(arguments, 0)
      var values = params.slice(1)
      var length = input.length
      var pos = -1

      if (err) {
        done(err)
        return
      }

      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos]
        }
      }

      input = values

      // Next or done.
      if (fn) {
        wrap(fn, next).apply(null, input)
      } else {
        done.apply(null, [null].concat(input))
      }
    }
  }

  // Add `fn` to the list.
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn)
    }

    fns.push(fn)

    return middleware
  }
}


/***/ }),

/***/ 3458:
/***/ ((module) => {

"use strict";


var slice = [].slice

module.exports = wrap

// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
function wrap(fn, callback) {
  var invoked

  return wrapped

  function wrapped() {
    var params = slice.call(arguments, 0)
    var callback = fn.length > params.length
    var result

    if (callback) {
      params.push(done)
    }

    try {
      result = fn.apply(null, params)
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error
      }

      return done(error)
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  // Invoke `next`, only once.
  function done() {
    if (!invoked) {
      invoked = true

      callback.apply(null, arguments)
    }
  }

  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value) {
    done(null, value)
  }
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 6623:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(1208)
var inherits = __nccwpck_require__(4124)

module.exports = unherit

// Create a custom constructor which can be modified without affecting the
// original class.
function unherit(Super) {
  var result
  var key
  var value

  inherits(Of, Super)
  inherits(From, Of)

  // Clone values.
  result = Of.prototype

  for (key in result) {
    value = result[key]

    if (value && typeof value === 'object') {
      result[key] = 'concat' in value ? value.concat() : xtend(value)
    }
  }

  return Of

  // Constructor accepting a single argument, which itself is an `arguments`
  // object.
  function From(parameters) {
    return Super.apply(this, parameters)
  }

  // Constructor accepting variadic arguments.
  function Of() {
    if (!(this instanceof Of)) {
      return new From(arguments)
    }

    return Super.apply(this, arguments)
  }
}


/***/ }),

/***/ 5075:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bail = __nccwpck_require__(7240)
var buffer = __nccwpck_require__(5625)
var extend = __nccwpck_require__(8171)
var plain = __nccwpck_require__(864)
var trough = __nccwpck_require__(3604)
var vfile = __nccwpck_require__(4860)

// Expose a frozen processor.
module.exports = unified().freeze()

var slice = [].slice
var own = {}.hasOwnProperty

// Process pipeline.
var pipeline = trough()
  .use(pipelineParse)
  .use(pipelineRun)
  .use(pipelineStringify)

function pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file)
}

function pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done)

  function done(error, tree, file) {
    if (error) {
      next(error)
    } else {
      ctx.tree = tree
      ctx.file = file
      next()
    }
  }
}

function pipelineStringify(p, ctx) {
  var result = p.stringify(ctx.tree, ctx.file)

  if (result === undefined || result === null) {
    // Empty.
  } else if (typeof result === 'string' || buffer(result)) {
    if ('value' in ctx.file) {
      ctx.file.value = result
    }

    ctx.file.contents = result
  } else {
    ctx.file.result = result
  }
}

// Function to create the first processor.
function unified() {
  var attachers = []
  var transformers = trough()
  var namespace = {}
  var freezeIndex = -1
  var frozen

  // Data management.
  processor.data = data

  // Lock.
  processor.freeze = freeze

  // Plugins.
  processor.attachers = attachers
  processor.use = use

  // API.
  processor.parse = parse
  processor.stringify = stringify
  processor.run = run
  processor.runSync = runSync
  processor.process = process
  processor.processSync = processSync

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = unified()
    var index = -1

    while (++index < attachers.length) {
      destination.use.apply(null, attachers[index])
    }

    destination.data(extend(true, {}, namespace))

    return destination
  }

  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values
    var transformer

    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex]

      if (values[1] === false) {
        continue
      }

      if (values[1] === true) {
        values[1] = undefined
      }

      transformer = values[0].apply(processor, values.slice(1))

      if (typeof transformer === 'function') {
        transformers.use(transformer)
      }
    }

    frozen = true
    freezeIndex = Infinity

    return processor
  }

  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen)
        namespace[key] = value
        return processor
      }

      // Get `key`.
      return (own.call(namespace, key) && namespace[key]) || null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen)
      namespace = key
      return processor
    }

    // Get space.
    return namespace
  }

  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  //     options).
  function use(value) {
    var settings

    assertUnfrozen('use', frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin.apply(null, arguments)
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = extend(namespace.settings || {}, settings)
    }

    return processor

    function addPreset(result) {
      addList(result.plugins)

      if (result.settings) {
        settings = extend(settings || {}, result.settings)
      }
    }

    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value)
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value)
        } else {
          addPreset(value)
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }
    }

    function addList(plugins) {
      var index = -1

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (typeof plugins === 'object' && 'length' in plugins) {
        while (++index < plugins.length) {
          add(plugins[index])
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin)

      if (entry) {
        if (plain(entry[1]) && plain(value)) {
          value = extend(true, entry[1], value)
        }

        entry[1] = value
      } else {
        attachers.push(slice.call(arguments))
      }
    }
  }

  function find(plugin) {
    var index = -1

    while (++index < attachers.length) {
      if (attachers[index][0] === plugin) {
        return attachers[index]
      }
    }
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    var file = vfile(doc)
    var Parser

    freeze()
    Parser = processor.Parser
    assertParser('parse', Parser)

    if (newable(Parser, 'parse')) {
      return new Parser(String(file), file).parse()
    }

    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node, file, cb) {
    assertNode(node)
    freeze()

    if (!cb && typeof file === 'function') {
      cb = file
      file = null
    }

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      transformers.run(node, vfile(file), done)

      function done(error, tree, file) {
        tree = tree || node
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(tree)
        } else {
          cb(null, tree, file)
        }
      }
    }
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node, file) {
    var result
    var complete

    run(node, file, done)

    assertDone('runSync', 'run', complete)

    return result

    function done(error, tree) {
      complete = true
      result = tree
      bail(error)
    }
  }

  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node, doc) {
    var file = vfile(doc)
    var Compiler

    freeze()
    Compiler = processor.Compiler
    assertCompiler('stringify', Compiler)
    assertNode(node)

    if (newable(Compiler, 'compile')) {
      return new Compiler(node, file).compile()
    }

    return Compiler(node, file) // eslint-disable-line new-cap
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc, cb) {
    freeze()
    assertParser('process', processor.Parser)
    assertCompiler('process', processor.Compiler)

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      var file = vfile(doc)

      pipeline.run(processor, {file: file}, done)

      function done(error) {
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(file)
        } else {
          cb(null, file)
        }
      }
    }
  }

  // Process the given document (in string or vfile representation), sync.
  function processSync(doc) {
    var file
    var complete

    freeze()
    assertParser('processSync', processor.Parser)
    assertCompiler('processSync', processor.Compiler)
    file = vfile(doc)

    process(file, done)

    assertDone('processSync', 'process', complete)

    return file

    function done(error) {
      complete = true
      bail(error)
    }
  }
}

// Check if `value` is a constructor.
function newable(value, name) {
  return (
    typeof value === 'function' &&
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    (keys(value.prototype) || name in value.prototype)
  )
}

// Check if `value` is an object with keys.
function keys(value) {
  var key
  for (key in value) {
    return true
  }

  return false
}

// Assert a parser is available.
function assertParser(name, Parser) {
  if (typeof Parser !== 'function') {
    throw new Error('Cannot `' + name + '` without `Parser`')
  }
}

// Assert a compiler is available.
function assertCompiler(name, Compiler) {
  if (typeof Compiler !== 'function') {
    throw new Error('Cannot `' + name + '` without `Compiler`')
  }
}

// Assert the processor is not frozen.
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
    )
  }
}

// Assert `node` is a unist node.
function assertNode(node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`')
  }
}

// Assert that `complete` is `true`.
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}


/***/ }),

/***/ 4070:
/***/ ((module) => {

"use strict";


module.exports = convert

function convert(test) {
  if (test == null) {
    return ok
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = []
  var index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return any

  function any() {
    var index = -1

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok() {
  return true
}


/***/ }),

/***/ 7970:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(199)

module.exports = removePosition

function removePosition(node, force) {
  visit(node, force ? hard : soft)
  return node
}

function hard(node) {
  delete node.position
}

function soft(node) {
  node.position = undefined
}


/***/ }),

/***/ 1957:
/***/ ((module) => {

"use strict";


var own = {}.hasOwnProperty

module.exports = stringify

function stringify(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if (own.call(value, 'position') || own.call(value, 'type')) {
    return position(value.position)
  }

  // Position.
  if (own.call(value, 'start') || own.call(value, 'end')) {
    return position(value)
  }

  // Point.
  if (own.call(value, 'line') || own.call(value, 'column')) {
    return point(value)
  }

  // ?
  return ''
}

function point(point) {
  if (!point || typeof point !== 'object') {
    point = {}
  }

  return index(point.line) + ':' + index(point.column)
}

function position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {}
  }

  return point(pos.start) + '-' + point(pos.end)
}

function index(value) {
  return value && typeof value === 'number' ? value : 1
}


/***/ }),

/***/ 9906:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 3246:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(4070)
var color = __nccwpck_require__(9906)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 199:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(3246)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2403:
/***/ ((module) => {

"use strict";


module.exports = factory

function factory(file) {
  var value = String(file)
  var indices = []
  var search = /\r?\n|\r/g

  while (search.exec(value)) {
    indices.push(search.lastIndex)
  }

  indices.push(value.length + 1)

  return {
    toPoint: offsetToPoint,
    toPosition: offsetToPoint,
    toOffset: pointToOffset
  }

  // Get the line and column-based `point` for `offset` in the bound indices.
  function offsetToPoint(offset) {
    var index = -1

    if (offset > -1 && offset < indices[indices.length - 1]) {
      while (++index < indices.length) {
        if (indices[index] > offset) {
          return {
            line: index + 1,
            column: offset - (indices[index - 1] || 0) + 1,
            offset: offset
          }
        }
      }
    }

    return {}
  }

  // Get the `offset` for a line and column-based `point` in the bound
  // indices.
  function pointToOffset(point) {
    var line = point && point.line
    var column = point && point.column
    var offset

    if (!isNaN(line) && !isNaN(column) && line - 1 in indices) {
      offset = (indices[line - 2] || 0) + column - 1 || 0
    }

    return offset > -1 && offset < indices[indices.length - 1] ? offset : -1
  }
}


/***/ }),

/***/ 4108:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var stringify = __nccwpck_require__(1957)

module.exports = VMessage

// Inherit from `Error#`.
function VMessagePrototype() {}
VMessagePrototype.prototype = Error.prototype
VMessage.prototype = new VMessagePrototype()

// Message properties.
var proto = VMessage.prototype

proto.file = ''
proto.name = ''
proto.reason = ''
proto.message = ''
proto.stack = ''
proto.fatal = null
proto.column = null
proto.line = null

// Construct a new VMessage.
//
// Note: We cannot invoke `Error` on the created context, as that adds readonly
// `line` and `column` attributes on Safari 9, thus throwing and failing the
// data.
function VMessage(reason, position, origin) {
  var parts
  var range
  var location

  if (typeof position === 'string') {
    origin = position
    position = null
  }

  parts = parseOrigin(origin)
  range = stringify(position) || '1:1'

  location = {
    start: {line: null, column: null},
    end: {line: null, column: null}
  }

  // Node.
  if (position && position.position) {
    position = position.position
  }

  if (position) {
    // Position.
    if (position.start) {
      location = position
      position = position.start
    } else {
      // Point.
      location.start = position
    }
  }

  if (reason.stack) {
    this.stack = reason.stack
    reason = reason.message
  }

  this.message = reason
  this.name = range
  this.reason = reason
  this.line = position ? position.line : null
  this.column = position ? position.column : null
  this.location = location
  this.source = parts[0]
  this.ruleId = parts[1]
}

function parseOrigin(origin) {
  var result = [null, null]
  var index

  if (typeof origin === 'string') {
    index = origin.indexOf(':')

    if (index === -1) {
      result[1] = origin
    } else {
      result[0] = origin.slice(0, index)
      result[1] = origin.slice(index + 1)
    }
  }

  return result
}


/***/ }),

/***/ 4860:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(77)


/***/ }),

/***/ 9523:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var p = __nccwpck_require__(9239)
var proc = __nccwpck_require__(6070)
var buffer = __nccwpck_require__(5625)

module.exports = VFile

var own = {}.hasOwnProperty

// Order of setting (least specific to most), we need this because otherwise
// `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
// stem can be set.
var order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname']

VFile.prototype.toString = toString

// Access full path (`~/index.min.js`).
Object.defineProperty(VFile.prototype, 'path', {get: getPath, set: setPath})

// Access parent path (`~`).
Object.defineProperty(VFile.prototype, 'dirname', {
  get: getDirname,
  set: setDirname
})

// Access basename (`index.min.js`).
Object.defineProperty(VFile.prototype, 'basename', {
  get: getBasename,
  set: setBasename
})

// Access extname (`.js`).
Object.defineProperty(VFile.prototype, 'extname', {
  get: getExtname,
  set: setExtname
})

// Access stem (`index.min`).
Object.defineProperty(VFile.prototype, 'stem', {get: getStem, set: setStem})

// Construct a new file.
function VFile(options) {
  var prop
  var index

  if (!options) {
    options = {}
  } else if (typeof options === 'string' || buffer(options)) {
    options = {contents: options}
  } else if ('message' in options && 'messages' in options) {
    return options
  }

  if (!(this instanceof VFile)) {
    return new VFile(options)
  }

  this.data = {}
  this.messages = []
  this.history = []
  this.cwd = proc.cwd()

  // Set path related properties in the correct order.
  index = -1

  while (++index < order.length) {
    prop = order[index]

    if (own.call(options, prop)) {
      this[prop] = options[prop]
    }
  }

  // Set non-path related properties.
  for (prop in options) {
    if (order.indexOf(prop) < 0) {
      this[prop] = options[prop]
    }
  }
}

function getPath() {
  return this.history[this.history.length - 1]
}

function setPath(path) {
  assertNonEmpty(path, 'path')

  if (this.path !== path) {
    this.history.push(path)
  }
}

function getDirname() {
  return typeof this.path === 'string' ? p.dirname(this.path) : undefined
}

function setDirname(dirname) {
  assertPath(this.path, 'dirname')
  this.path = p.join(dirname || '', this.basename)
}

function getBasename() {
  return typeof this.path === 'string' ? p.basename(this.path) : undefined
}

function setBasename(basename) {
  assertNonEmpty(basename, 'basename')
  assertPart(basename, 'basename')
  this.path = p.join(this.dirname || '', basename)
}

function getExtname() {
  return typeof this.path === 'string' ? p.extname(this.path) : undefined
}

function setExtname(extname) {
  assertPart(extname, 'extname')
  assertPath(this.path, 'extname')

  if (extname) {
    if (extname.charCodeAt(0) !== 46 /* `.` */) {
      throw new Error('`extname` must start with `.`')
    }

    if (extname.indexOf('.', 1) > -1) {
      throw new Error('`extname` cannot contain multiple dots')
    }
  }

  this.path = p.join(this.dirname, this.stem + (extname || ''))
}

function getStem() {
  return typeof this.path === 'string'
    ? p.basename(this.path, this.extname)
    : undefined
}

function setStem(stem) {
  assertNonEmpty(stem, 'stem')
  assertPart(stem, 'stem')
  this.path = p.join(this.dirname || '', stem + (this.extname || ''))
}

// Get the value of the file.
function toString(encoding) {
  return (this.contents || '').toString(encoding)
}

// Assert that `part` is not a path (i.e., does not contain `p.sep`).
function assertPart(part, name) {
  if (part && part.indexOf(p.sep) > -1) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + p.sep + '`'
    )
  }
}

// Assert that `part` is not empty.
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

// Assert `path` exists.
function assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}


/***/ }),

/***/ 77:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var VMessage = __nccwpck_require__(4108)
var VFile = __nccwpck_require__(9523)

module.exports = VFile

VFile.prototype.message = message
VFile.prototype.info = info
VFile.prototype.fail = fail

// Create a message with `reason` at `position`.
// When an error is passed in as `reason`, copies the stack.
function message(reason, position, origin) {
  var message = new VMessage(reason, position, origin)

  if (this.path) {
    message.name = this.path + ':' + message.name
    message.file = this.path
  }

  message.fatal = false

  this.messages.push(message)

  return message
}

// Fail: creates a vmessage, associates it with the file, and throws it.
function fail() {
  var message = this.message.apply(this, arguments)

  message.fatal = true

  throw message
}

// Info: creates a vmessage, associates it with the file, and marks the fatality
// as null.
function info() {
  var message = this.message.apply(this, arguments)

  message.fatal = null

  return message
}


/***/ }),

/***/ 9239:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(1017)


/***/ }),

/***/ 6070:
/***/ ((module) => {

"use strict";


module.exports = process


/***/ }),

/***/ 1208:
/***/ ((module) => {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8348:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"nbsp":" ","iexcl":"¡","cent":"¢","pound":"£","curren":"¤","yen":"¥","brvbar":"¦","sect":"§","uml":"¨","copy":"©","ordf":"ª","laquo":"«","not":"¬","shy":"­","reg":"®","macr":"¯","deg":"°","plusmn":"±","sup2":"²","sup3":"³","acute":"´","micro":"µ","para":"¶","middot":"·","cedil":"¸","sup1":"¹","ordm":"º","raquo":"»","frac14":"¼","frac12":"½","frac34":"¾","iquest":"¿","Agrave":"À","Aacute":"Á","Acirc":"Â","Atilde":"Ã","Auml":"Ä","Aring":"Å","AElig":"Æ","Ccedil":"Ç","Egrave":"È","Eacute":"É","Ecirc":"Ê","Euml":"Ë","Igrave":"Ì","Iacute":"Í","Icirc":"Î","Iuml":"Ï","ETH":"Ð","Ntilde":"Ñ","Ograve":"Ò","Oacute":"Ó","Ocirc":"Ô","Otilde":"Õ","Ouml":"Ö","times":"×","Oslash":"Ø","Ugrave":"Ù","Uacute":"Ú","Ucirc":"Û","Uuml":"Ü","Yacute":"Ý","THORN":"Þ","szlig":"ß","agrave":"à","aacute":"á","acirc":"â","atilde":"ã","auml":"ä","aring":"å","aelig":"æ","ccedil":"ç","egrave":"è","eacute":"é","ecirc":"ê","euml":"ë","igrave":"ì","iacute":"í","icirc":"î","iuml":"ï","eth":"ð","ntilde":"ñ","ograve":"ò","oacute":"ó","ocirc":"ô","otilde":"õ","ouml":"ö","divide":"÷","oslash":"ø","ugrave":"ù","uacute":"ú","ucirc":"û","uuml":"ü","yacute":"ý","thorn":"þ","yuml":"ÿ","fnof":"ƒ","Alpha":"Α","Beta":"Β","Gamma":"Γ","Delta":"Δ","Epsilon":"Ε","Zeta":"Ζ","Eta":"Η","Theta":"Θ","Iota":"Ι","Kappa":"Κ","Lambda":"Λ","Mu":"Μ","Nu":"Ν","Xi":"Ξ","Omicron":"Ο","Pi":"Π","Rho":"Ρ","Sigma":"Σ","Tau":"Τ","Upsilon":"Υ","Phi":"Φ","Chi":"Χ","Psi":"Ψ","Omega":"Ω","alpha":"α","beta":"β","gamma":"γ","delta":"δ","epsilon":"ε","zeta":"ζ","eta":"η","theta":"θ","iota":"ι","kappa":"κ","lambda":"λ","mu":"μ","nu":"ν","xi":"ξ","omicron":"ο","pi":"π","rho":"ρ","sigmaf":"ς","sigma":"σ","tau":"τ","upsilon":"υ","phi":"φ","chi":"χ","psi":"ψ","omega":"ω","thetasym":"ϑ","upsih":"ϒ","piv":"ϖ","bull":"•","hellip":"…","prime":"′","Prime":"″","oline":"‾","frasl":"⁄","weierp":"℘","image":"ℑ","real":"ℜ","trade":"™","alefsym":"ℵ","larr":"←","uarr":"↑","rarr":"→","darr":"↓","harr":"↔","crarr":"↵","lArr":"⇐","uArr":"⇑","rArr":"⇒","dArr":"⇓","hArr":"⇔","forall":"∀","part":"∂","exist":"∃","empty":"∅","nabla":"∇","isin":"∈","notin":"∉","ni":"∋","prod":"∏","sum":"∑","minus":"−","lowast":"∗","radic":"√","prop":"∝","infin":"∞","ang":"∠","and":"∧","or":"∨","cap":"∩","cup":"∪","int":"∫","there4":"∴","sim":"∼","cong":"≅","asymp":"≈","ne":"≠","equiv":"≡","le":"≤","ge":"≥","sub":"⊂","sup":"⊃","nsub":"⊄","sube":"⊆","supe":"⊇","oplus":"⊕","otimes":"⊗","perp":"⊥","sdot":"⋅","lceil":"⌈","rceil":"⌉","lfloor":"⌊","rfloor":"⌋","lang":"〈","rang":"〉","loz":"◊","spades":"♠","clubs":"♣","hearts":"♥","diams":"♦","quot":"\\"","amp":"&","lt":"<","gt":">","OElig":"Œ","oelig":"œ","Scaron":"Š","scaron":"š","Yuml":"Ÿ","circ":"ˆ","tilde":"˜","ensp":" ","emsp":" ","thinsp":" ","zwnj":"‌","zwj":"‍","lrm":"‎","rlm":"‏","ndash":"–","mdash":"—","lsquo":"‘","rsquo":"’","sbquo":"‚","ldquo":"“","rdquo":"”","bdquo":"„","dagger":"†","Dagger":"‡","permil":"‰","lsaquo":"‹","rsaquo":"›","euro":"€"}');

/***/ }),

/***/ 7452:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"AElig":"Æ","AMP":"&","Aacute":"Á","Acirc":"Â","Agrave":"À","Aring":"Å","Atilde":"Ã","Auml":"Ä","COPY":"©","Ccedil":"Ç","ETH":"Ð","Eacute":"É","Ecirc":"Ê","Egrave":"È","Euml":"Ë","GT":">","Iacute":"Í","Icirc":"Î","Igrave":"Ì","Iuml":"Ï","LT":"<","Ntilde":"Ñ","Oacute":"Ó","Ocirc":"Ô","Ograve":"Ò","Oslash":"Ø","Otilde":"Õ","Ouml":"Ö","QUOT":"\\"","REG":"®","THORN":"Þ","Uacute":"Ú","Ucirc":"Û","Ugrave":"Ù","Uuml":"Ü","Yacute":"Ý","aacute":"á","acirc":"â","acute":"´","aelig":"æ","agrave":"à","amp":"&","aring":"å","atilde":"ã","auml":"ä","brvbar":"¦","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","curren":"¤","deg":"°","divide":"÷","eacute":"é","ecirc":"ê","egrave":"è","eth":"ð","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","iacute":"í","icirc":"î","iexcl":"¡","igrave":"ì","iquest":"¿","iuml":"ï","laquo":"«","lt":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","ntilde":"ñ","oacute":"ó","ocirc":"ô","ograve":"ò","ordf":"ª","ordm":"º","oslash":"ø","otilde":"õ","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","raquo":"»","reg":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","thorn":"þ","times":"×","uacute":"ú","ucirc":"û","ugrave":"ù","uml":"¨","uuml":"ü","yacute":"ý","yen":"¥","yuml":"ÿ"}');

/***/ }),

/***/ 2661:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"AEli":"Æ","AElig":"Æ","AM":"&","AMP":"&","Aacut":"Á","Aacute":"Á","Abreve":"Ă","Acir":"Â","Acirc":"Â","Acy":"А","Afr":"𝔄","Agrav":"À","Agrave":"À","Alpha":"Α","Amacr":"Ā","And":"⩓","Aogon":"Ą","Aopf":"𝔸","ApplyFunction":"⁡","Arin":"Å","Aring":"Å","Ascr":"𝒜","Assign":"≔","Atild":"Ã","Atilde":"Ã","Aum":"Ä","Auml":"Ä","Backslash":"∖","Barv":"⫧","Barwed":"⌆","Bcy":"Б","Because":"∵","Bernoullis":"ℬ","Beta":"Β","Bfr":"𝔅","Bopf":"𝔹","Breve":"˘","Bscr":"ℬ","Bumpeq":"≎","CHcy":"Ч","COP":"©","COPY":"©","Cacute":"Ć","Cap":"⋒","CapitalDifferentialD":"ⅅ","Cayleys":"ℭ","Ccaron":"Č","Ccedi":"Ç","Ccedil":"Ç","Ccirc":"Ĉ","Cconint":"∰","Cdot":"Ċ","Cedilla":"¸","CenterDot":"·","Cfr":"ℭ","Chi":"Χ","CircleDot":"⊙","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","Colon":"∷","Colone":"⩴","Congruent":"≡","Conint":"∯","ContourIntegral":"∮","Copf":"ℂ","Coproduct":"∐","CounterClockwiseContourIntegral":"∳","Cross":"⨯","Cscr":"𝒞","Cup":"⋓","CupCap":"≍","DD":"ⅅ","DDotrahd":"⤑","DJcy":"Ђ","DScy":"Ѕ","DZcy":"Џ","Dagger":"‡","Darr":"↡","Dashv":"⫤","Dcaron":"Ď","Dcy":"Д","Del":"∇","Delta":"Δ","Dfr":"𝔇","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","Diamond":"⋄","DifferentialD":"ⅆ","Dopf":"𝔻","Dot":"¨","DotDot":"⃜","DotEqual":"≐","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrow":"↓","DownArrowBar":"⤓","DownArrowUpArrow":"⇵","DownBreve":"̑","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVector":"↽","DownLeftVectorBar":"⥖","DownRightTeeVector":"⥟","DownRightVector":"⇁","DownRightVectorBar":"⥗","DownTee":"⊤","DownTeeArrow":"↧","Downarrow":"⇓","Dscr":"𝒟","Dstrok":"Đ","ENG":"Ŋ","ET":"Ð","ETH":"Ð","Eacut":"É","Eacute":"É","Ecaron":"Ě","Ecir":"Ê","Ecirc":"Ê","Ecy":"Э","Edot":"Ė","Efr":"𝔈","Egrav":"È","Egrave":"È","Element":"∈","Emacr":"Ē","EmptySmallSquare":"◻","EmptyVerySmallSquare":"▫","Eogon":"Ę","Eopf":"𝔼","Epsilon":"Ε","Equal":"⩵","EqualTilde":"≂","Equilibrium":"⇌","Escr":"ℰ","Esim":"⩳","Eta":"Η","Eum":"Ë","Euml":"Ë","Exists":"∃","ExponentialE":"ⅇ","Fcy":"Ф","Ffr":"𝔉","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","Fopf":"𝔽","ForAll":"∀","Fouriertrf":"ℱ","Fscr":"ℱ","GJcy":"Ѓ","G":">","GT":">","Gamma":"Γ","Gammad":"Ϝ","Gbreve":"Ğ","Gcedil":"Ģ","Gcirc":"Ĝ","Gcy":"Г","Gdot":"Ġ","Gfr":"𝔊","Gg":"⋙","Gopf":"𝔾","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","Gt":"≫","HARDcy":"Ъ","Hacek":"ˇ","Hat":"^","Hcirc":"Ĥ","Hfr":"ℌ","HilbertSpace":"ℋ","Hopf":"ℍ","HorizontalLine":"─","Hscr":"ℋ","Hstrok":"Ħ","HumpDownHump":"≎","HumpEqual":"≏","IEcy":"Е","IJlig":"Ĳ","IOcy":"Ё","Iacut":"Í","Iacute":"Í","Icir":"Î","Icirc":"Î","Icy":"И","Idot":"İ","Ifr":"ℑ","Igrav":"Ì","Igrave":"Ì","Im":"ℑ","Imacr":"Ī","ImaginaryI":"ⅈ","Implies":"⇒","Int":"∬","Integral":"∫","Intersection":"⋂","InvisibleComma":"⁣","InvisibleTimes":"⁢","Iogon":"Į","Iopf":"𝕀","Iota":"Ι","Iscr":"ℐ","Itilde":"Ĩ","Iukcy":"І","Ium":"Ï","Iuml":"Ï","Jcirc":"Ĵ","Jcy":"Й","Jfr":"𝔍","Jopf":"𝕁","Jscr":"𝒥","Jsercy":"Ј","Jukcy":"Є","KHcy":"Х","KJcy":"Ќ","Kappa":"Κ","Kcedil":"Ķ","Kcy":"К","Kfr":"𝔎","Kopf":"𝕂","Kscr":"𝒦","LJcy":"Љ","L":"<","LT":"<","Lacute":"Ĺ","Lambda":"Λ","Lang":"⟪","Laplacetrf":"ℒ","Larr":"↞","Lcaron":"Ľ","Lcedil":"Ļ","Lcy":"Л","LeftAngleBracket":"⟨","LeftArrow":"←","LeftArrowBar":"⇤","LeftArrowRightArrow":"⇆","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVector":"⇃","LeftDownVectorBar":"⥙","LeftFloor":"⌊","LeftRightArrow":"↔","LeftRightVector":"⥎","LeftTee":"⊣","LeftTeeArrow":"↤","LeftTeeVector":"⥚","LeftTriangle":"⊲","LeftTriangleBar":"⧏","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVector":"↿","LeftUpVectorBar":"⥘","LeftVector":"↼","LeftVectorBar":"⥒","Leftarrow":"⇐","Leftrightarrow":"⇔","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","LessLess":"⪡","LessSlantEqual":"⩽","LessTilde":"≲","Lfr":"𝔏","Ll":"⋘","Lleftarrow":"⇚","Lmidot":"Ŀ","LongLeftArrow":"⟵","LongLeftRightArrow":"⟷","LongRightArrow":"⟶","Longleftarrow":"⟸","Longleftrightarrow":"⟺","Longrightarrow":"⟹","Lopf":"𝕃","LowerLeftArrow":"↙","LowerRightArrow":"↘","Lscr":"ℒ","Lsh":"↰","Lstrok":"Ł","Lt":"≪","Map":"⤅","Mcy":"М","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","MinusPlus":"∓","Mopf":"𝕄","Mscr":"ℳ","Mu":"Μ","NJcy":"Њ","Nacute":"Ń","Ncaron":"Ň","Ncedil":"Ņ","Ncy":"Н","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","Nfr":"𝔑","NoBreak":"⁠","NonBreakingSpace":" ","Nopf":"ℕ","Not":"⫬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","NotLeftTriangle":"⋪","NotLeftTriangleBar":"⧏̸","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangle":"⋫","NotRightTriangleBar":"⧐̸","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","Nscr":"𝒩","Ntild":"Ñ","Ntilde":"Ñ","Nu":"Ν","OElig":"Œ","Oacut":"Ó","Oacute":"Ó","Ocir":"Ô","Ocirc":"Ô","Ocy":"О","Odblac":"Ő","Ofr":"𝔒","Ograv":"Ò","Ograve":"Ò","Omacr":"Ō","Omega":"Ω","Omicron":"Ο","Oopf":"𝕆","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","Or":"⩔","Oscr":"𝒪","Oslas":"Ø","Oslash":"Ø","Otild":"Õ","Otilde":"Õ","Otimes":"⨷","Oum":"Ö","Ouml":"Ö","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","PartialD":"∂","Pcy":"П","Pfr":"𝔓","Phi":"Φ","Pi":"Π","PlusMinus":"±","Poincareplane":"ℌ","Popf":"ℙ","Pr":"⪻","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","Prime":"″","Product":"∏","Proportion":"∷","Proportional":"∝","Pscr":"𝒫","Psi":"Ψ","QUO":"\\"","QUOT":"\\"","Qfr":"𝔔","Qopf":"ℚ","Qscr":"𝒬","RBarr":"⤐","RE":"®","REG":"®","Racute":"Ŕ","Rang":"⟫","Rarr":"↠","Rarrtl":"⤖","Rcaron":"Ř","Rcedil":"Ŗ","Rcy":"Р","Re":"ℜ","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","Rfr":"ℜ","Rho":"Ρ","RightAngleBracket":"⟩","RightArrow":"→","RightArrowBar":"⇥","RightArrowLeftArrow":"⇄","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVector":"⇂","RightDownVectorBar":"⥕","RightFloor":"⌋","RightTee":"⊢","RightTeeArrow":"↦","RightTeeVector":"⥛","RightTriangle":"⊳","RightTriangleBar":"⧐","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVector":"↾","RightUpVectorBar":"⥔","RightVector":"⇀","RightVectorBar":"⥓","Rightarrow":"⇒","Ropf":"ℝ","RoundImplies":"⥰","Rrightarrow":"⇛","Rscr":"ℛ","Rsh":"↱","RuleDelayed":"⧴","SHCHcy":"Щ","SHcy":"Ш","SOFTcy":"Ь","Sacute":"Ś","Sc":"⪼","Scaron":"Š","Scedil":"Ş","Scirc":"Ŝ","Scy":"С","Sfr":"𝔖","ShortDownArrow":"↓","ShortLeftArrow":"←","ShortRightArrow":"→","ShortUpArrow":"↑","Sigma":"Σ","SmallCircle":"∘","Sopf":"𝕊","Sqrt":"√","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","Sscr":"𝒮","Star":"⋆","Sub":"⋐","Subset":"⋐","SubsetEqual":"⊆","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","SuchThat":"∋","Sum":"∑","Sup":"⋑","Superset":"⊃","SupersetEqual":"⊇","Supset":"⋑","THOR":"Þ","THORN":"Þ","TRADE":"™","TSHcy":"Ћ","TScy":"Ц","Tab":"\\t","Tau":"Τ","Tcaron":"Ť","Tcedil":"Ţ","Tcy":"Т","Tfr":"𝔗","Therefore":"∴","Theta":"Θ","ThickSpace":"  ","ThinSpace":" ","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","Topf":"𝕋","TripleDot":"⃛","Tscr":"𝒯","Tstrok":"Ŧ","Uacut":"Ú","Uacute":"Ú","Uarr":"↟","Uarrocir":"⥉","Ubrcy":"Ў","Ubreve":"Ŭ","Ucir":"Û","Ucirc":"Û","Ucy":"У","Udblac":"Ű","Ufr":"𝔘","Ugrav":"Ù","Ugrave":"Ù","Umacr":"Ū","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","Uopf":"𝕌","UpArrow":"↑","UpArrowBar":"⤒","UpArrowDownArrow":"⇅","UpDownArrow":"↕","UpEquilibrium":"⥮","UpTee":"⊥","UpTeeArrow":"↥","Uparrow":"⇑","Updownarrow":"⇕","UpperLeftArrow":"↖","UpperRightArrow":"↗","Upsi":"ϒ","Upsilon":"Υ","Uring":"Ů","Uscr":"𝒰","Utilde":"Ũ","Uum":"Ü","Uuml":"Ü","VDash":"⊫","Vbar":"⫫","Vcy":"В","Vdash":"⊩","Vdashl":"⫦","Vee":"⋁","Verbar":"‖","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","Vopf":"𝕍","Vscr":"𝒱","Vvdash":"⊪","Wcirc":"Ŵ","Wedge":"⋀","Wfr":"𝔚","Wopf":"𝕎","Wscr":"𝒲","Xfr":"𝔛","Xi":"Ξ","Xopf":"𝕏","Xscr":"𝒳","YAcy":"Я","YIcy":"Ї","YUcy":"Ю","Yacut":"Ý","Yacute":"Ý","Ycirc":"Ŷ","Ycy":"Ы","Yfr":"𝔜","Yopf":"𝕐","Yscr":"𝒴","Yuml":"Ÿ","ZHcy":"Ж","Zacute":"Ź","Zcaron":"Ž","Zcy":"З","Zdot":"Ż","ZeroWidthSpace":"​","Zeta":"Ζ","Zfr":"ℨ","Zopf":"ℤ","Zscr":"𝒵","aacut":"á","aacute":"á","abreve":"ă","ac":"∾","acE":"∾̳","acd":"∿","acir":"â","acirc":"â","acut":"´","acute":"´","acy":"а","aeli":"æ","aelig":"æ","af":"⁡","afr":"𝔞","agrav":"à","agrave":"à","alefsym":"ℵ","aleph":"ℵ","alpha":"α","amacr":"ā","amalg":"⨿","am":"&","amp":"&","and":"∧","andand":"⩕","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsd":"∡","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","aogon":"ą","aopf":"𝕒","ap":"≈","apE":"⩰","apacir":"⩯","ape":"≊","apid":"≋","apos":"\'","approx":"≈","approxeq":"≊","arin":"å","aring":"å","ascr":"𝒶","ast":"*","asymp":"≈","asympeq":"≍","atild":"ã","atilde":"ã","aum":"ä","auml":"ä","awconint":"∳","awint":"⨑","bNot":"⫭","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","barvee":"⊽","barwed":"⌅","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","beta":"β","beth":"ℶ","between":"≬","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bnot":"⌐","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxDL":"╗","boxDR":"╔","boxDl":"╖","boxDr":"╓","boxH":"═","boxHD":"╦","boxHU":"╩","boxHd":"╤","boxHu":"╧","boxUL":"╝","boxUR":"╚","boxUl":"╜","boxUr":"╙","boxV":"║","boxVH":"╬","boxVL":"╣","boxVR":"╠","boxVh":"╫","boxVl":"╢","boxVr":"╟","boxbox":"⧉","boxdL":"╕","boxdR":"╒","boxdl":"┐","boxdr":"┌","boxh":"─","boxhD":"╥","boxhU":"╨","boxhd":"┬","boxhu":"┴","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxuL":"╛","boxuR":"╘","boxul":"┘","boxur":"└","boxv":"│","boxvH":"╪","boxvL":"╡","boxvR":"╞","boxvh":"┼","boxvl":"┤","boxvr":"├","bprime":"‵","breve":"˘","brvba":"¦","brvbar":"¦","bscr":"𝒷","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsol":"\\\\","bsolb":"⧅","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","bumpeq":"≏","cacute":"ć","cap":"∩","capand":"⩄","capbrcup":"⩉","capcap":"⩋","capcup":"⩇","capdot":"⩀","caps":"∩︀","caret":"⁁","caron":"ˇ","ccaps":"⩍","ccaron":"č","ccedi":"ç","ccedil":"ç","ccirc":"ĉ","ccups":"⩌","ccupssm":"⩐","cdot":"ċ","cedi":"¸","cedil":"¸","cemptyv":"⦲","cen":"¢","cent":"¢","centerdot":"·","cfr":"𝔠","chcy":"ч","check":"✓","checkmark":"✓","chi":"χ","cir":"○","cirE":"⧃","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledR":"®","circledS":"Ⓢ","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","clubs":"♣","clubsuit":"♣","colon":":","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","conint":"∮","copf":"𝕔","coprod":"∐","cop":"©","copy":"©","copysr":"℗","crarr":"↵","cross":"✗","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cup":"∪","cupbrcap":"⩈","cupcap":"⩆","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curre":"¤","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dArr":"⇓","dHar":"⥥","dagger":"†","daleth":"ℸ","darr":"↓","dash":"‐","dashv":"⊣","dbkarow":"⤏","dblac":"˝","dcaron":"ď","dcy":"д","dd":"ⅆ","ddagger":"‡","ddarr":"⇊","ddotseq":"⩷","de":"°","deg":"°","delta":"δ","demptyv":"⦱","dfisht":"⥿","dfr":"𝔡","dharl":"⇃","dharr":"⇂","diam":"⋄","diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","digamma":"ϝ","disin":"⋲","div":"÷","divid":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","dopf":"𝕕","dot":"˙","doteq":"≐","doteqdot":"≑","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","downarrow":"↓","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","dscr":"𝒹","dscy":"ѕ","dsol":"⧶","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","dzcy":"џ","dzigrarr":"⟿","eDDot":"⩷","eDot":"≑","eacut":"é","eacute":"é","easter":"⩮","ecaron":"ě","ecir":"ê","ecirc":"ê","ecolon":"≕","ecy":"э","edot":"ė","ee":"ⅇ","efDot":"≒","efr":"𝔢","eg":"⪚","egrav":"è","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","emacr":"ē","empty":"∅","emptyset":"∅","emptyv":"∅","emsp13":" ","emsp14":" ","emsp":" ","eng":"ŋ","ensp":" ","eogon":"ę","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","equals":"=","equest":"≟","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erDot":"≓","erarr":"⥱","escr":"ℯ","esdot":"≐","esim":"≂","eta":"η","et":"ð","eth":"ð","eum":"ë","euml":"ë","euro":"€","excl":"!","exist":"∃","expectation":"ℰ","exponentiale":"ⅇ","fallingdotseq":"≒","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","ffr":"𝔣","filig":"ﬁ","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","fopf":"𝕗","forall":"∀","fork":"⋔","forkv":"⫙","fpartint":"⨍","frac1":"¼","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac3":"¾","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","gE":"≧","gEl":"⪌","gacute":"ǵ","gamma":"γ","gammad":"ϝ","gap":"⪆","gbreve":"ğ","gcirc":"ĝ","gcy":"г","gdot":"ġ","ge":"≥","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","ges":"⩾","gescc":"⪩","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","gfr":"𝔤","gg":"≫","ggg":"⋙","gimel":"ℷ","gjcy":"ѓ","gl":"≷","glE":"⪒","gla":"⪥","glj":"⪤","gnE":"≩","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gneq":"⪈","gneqq":"≩","gnsim":"⋧","gopf":"𝕘","grave":"`","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","g":">","gt":">","gtcc":"⪧","gtcir":"⩺","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","hArr":"⇔","hairsp":" ","half":"½","hamilt":"ℋ","hardcy":"ъ","harr":"↔","harrcir":"⥈","harrw":"↭","hbar":"ℏ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","horbar":"―","hscr":"𝒽","hslash":"ℏ","hstrok":"ħ","hybull":"⁃","hyphen":"‐","iacut":"í","iacute":"í","ic":"⁣","icir":"î","icirc":"î","icy":"и","iecy":"е","iexc":"¡","iexcl":"¡","iff":"⇔","ifr":"𝔦","igrav":"ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","ijlig":"ĳ","imacr":"ī","image":"ℑ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","imof":"⊷","imped":"Ƶ","in":"∈","incare":"℅","infin":"∞","infintie":"⧝","inodot":"ı","int":"∫","intcal":"⊺","integers":"ℤ","intercal":"⊺","intlarhk":"⨗","intprod":"⨼","iocy":"ё","iogon":"į","iopf":"𝕚","iota":"ι","iprod":"⨼","iques":"¿","iquest":"¿","iscr":"𝒾","isin":"∈","isinE":"⋹","isindot":"⋵","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","itilde":"ĩ","iukcy":"і","ium":"ï","iuml":"ï","jcirc":"ĵ","jcy":"й","jfr":"𝔧","jmath":"ȷ","jopf":"𝕛","jscr":"𝒿","jsercy":"ј","jukcy":"є","kappa":"κ","kappav":"ϰ","kcedil":"ķ","kcy":"к","kfr":"𝔨","kgreen":"ĸ","khcy":"х","kjcy":"ќ","kopf":"𝕜","kscr":"𝓀","lAarr":"⇚","lArr":"⇐","lAtail":"⤛","lBarr":"⤎","lE":"≦","lEg":"⪋","lHar":"⥢","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","lambda":"λ","lang":"⟨","langd":"⦑","langle":"⟨","lap":"⪅","laqu":"«","laquo":"«","larr":"←","larrb":"⇤","larrbfs":"⤟","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","lat":"⪫","latail":"⤙","late":"⪭","lates":"⪭︀","lbarr":"⤌","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","lcaron":"ľ","lcedil":"ļ","lceil":"⌈","lcub":"{","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","leftarrow":"←","leftarrowtail":"↢","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","leftthreetimes":"⋋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","les":"⩽","lescc":"⪨","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","lessgtr":"≶","lesssim":"≲","lfisht":"⥼","lfloor":"⌊","lfr":"𝔩","lg":"≶","lgE":"⪑","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","ljcy":"љ","ll":"≪","llarr":"⇇","llcorner":"⌞","llhard":"⥫","lltri":"◺","lmidot":"ŀ","lmoust":"⎰","lmoustache":"⎰","lnE":"≨","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","longleftrightarrow":"⟷","longmapsto":"⟼","longrightarrow":"⟶","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","lstrok":"ł","l":"<","lt":"<","ltcc":"⪦","ltcir":"⩹","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltrPar":"⦖","ltri":"◃","ltrie":"⊴","ltrif":"◂","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","mDDot":"∺","mac":"¯","macr":"¯","male":"♂","malt":"✠","maltese":"✠","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","mcy":"м","mdash":"—","measuredangle":"∡","mfr":"𝔪","mho":"℧","micr":"µ","micro":"µ","mid":"∣","midast":"*","midcir":"⫰","middo":"·","middot":"·","minus":"−","minusb":"⊟","minusd":"∸","minusdu":"⨪","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","mopf":"𝕞","mp":"∓","mscr":"𝓂","mstpos":"∾","mu":"μ","multimap":"⊸","mumap":"⊸","nGg":"⋙̸","nGt":"≫⃒","nGtv":"≫̸","nLeftarrow":"⇍","nLeftrightarrow":"⇎","nLl":"⋘̸","nLt":"≪⃒","nLtv":"≪̸","nRightarrow":"⇏","nVDash":"⊯","nVdash":"⊮","nabla":"∇","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natur":"♮","natural":"♮","naturals":"ℕ","nbs":" ","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","ncaron":"ň","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","ncy":"н","ndash":"–","ne":"≠","neArr":"⇗","nearhk":"⤤","nearr":"↗","nearrow":"↗","nedot":"≐̸","nequiv":"≢","nesear":"⤨","nesim":"≂̸","nexist":"∄","nexists":"∄","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","ngsim":"≵","ngt":"≯","ngtr":"≯","nhArr":"⇎","nharr":"↮","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","njcy":"њ","nlArr":"⇍","nlE":"≦̸","nlarr":"↚","nldr":"‥","nle":"≰","nleftarrow":"↚","nleftrightarrow":"↮","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nlsim":"≴","nlt":"≮","nltri":"⋪","nltrie":"⋬","nmid":"∤","nopf":"𝕟","no":"¬","not":"¬","notin":"∉","notinE":"⋹̸","notindot":"⋵̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","npar":"∦","nparallel":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","npre":"⪯̸","nprec":"⊀","npreceq":"⪯̸","nrArr":"⇏","nrarr":"↛","nrarrc":"⤳̸","nrarrw":"↝̸","nrightarrow":"↛","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","ntild":"ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","nu":"ν","num":"#","numero":"№","numsp":" ","nvDash":"⊭","nvHarr":"⤄","nvap":"≍⃒","nvdash":"⊬","nvge":"≥⃒","nvgt":">⃒","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwArr":"⇖","nwarhk":"⤣","nwarr":"↖","nwarrow":"↖","nwnear":"⤧","oS":"Ⓢ","oacut":"ó","oacute":"ó","oast":"⊛","ocir":"ô","ocirc":"ô","ocy":"о","odash":"⊝","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","oelig":"œ","ofcir":"⦿","ofr":"𝔬","ogon":"˛","ograv":"ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","omacr":"ō","omega":"ω","omicron":"ο","omid":"⦶","ominus":"⊖","oopf":"𝕠","opar":"⦷","operp":"⦹","oplus":"⊕","or":"∨","orarr":"↻","ord":"º","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oscr":"ℴ","oslas":"ø","oslash":"ø","osol":"⊘","otild":"õ","otilde":"õ","otimes":"⊗","otimesas":"⨶","oum":"ö","ouml":"ö","ovbar":"⌽","par":"¶","para":"¶","parallel":"∥","parsim":"⫳","parsl":"⫽","part":"∂","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","pfr":"𝔭","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plus":"+","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plusdo":"∔","plusdu":"⨥","pluse":"⩲","plusm":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","pointint":"⨕","popf":"𝕡","poun":"£","pound":"£","pr":"≺","prE":"⪳","prap":"⪷","prcue":"≼","pre":"⪯","prec":"≺","precapprox":"⪷","preccurlyeq":"≼","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","precsim":"≾","prime":"′","primes":"ℙ","prnE":"⪵","prnap":"⪹","prnsim":"⋨","prod":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","propto":"∝","prsim":"≾","prurel":"⊰","pscr":"𝓅","psi":"ψ","puncsp":" ","qfr":"𝔮","qint":"⨌","qopf":"𝕢","qprime":"⁗","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quo":"\\"","quot":"\\"","rAarr":"⇛","rArr":"⇒","rAtail":"⤜","rBarr":"⤏","rHar":"⥤","race":"∽̱","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","rangd":"⦒","range":"⦥","rangle":"⟩","raqu":"»","raquo":"»","rarr":"→","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","rarrtl":"↣","rarrw":"↝","ratail":"⤚","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","rcaron":"ř","rcedil":"ŗ","rceil":"⌉","rcub":"}","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","rect":"▭","re":"®","reg":"®","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","rhard":"⇁","rharu":"⇀","rharul":"⥬","rho":"ρ","rhov":"ϱ","rightarrow":"→","rightarrowtail":"↣","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","rightthreetimes":"⋌","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoust":"⎱","rmoustache":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","roplus":"⨮","rotimes":"⨵","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","rsaquo":"›","rscr":"𝓇","rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","ruluhar":"⥨","rx":"℞","sacute":"ś","sbquo":"‚","sc":"≻","scE":"⪴","scap":"⪸","scaron":"š","sccue":"≽","sce":"⪰","scedil":"ş","scirc":"ŝ","scnE":"⪶","scnap":"⪺","scnsim":"⋩","scpolint":"⨓","scsim":"≿","scy":"с","sdot":"⋅","sdotb":"⊡","sdote":"⩦","seArr":"⇘","searhk":"⤥","searr":"↘","searrow":"↘","sec":"§","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","sfr":"𝔰","sfrown":"⌢","sharp":"♯","shchcy":"щ","shcy":"ш","shortmid":"∣","shortparallel":"∥","sh":"­","shy":"­","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","softcy":"ь","sol":"/","solb":"⧄","solbar":"⌿","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","squ":"□","square":"□","squarf":"▪","squf":"▪","srarr":"→","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","subE":"⫅","subdot":"⪽","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","subseteq":"⊆","subseteqq":"⫅","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succ":"≻","succapprox":"⪸","succcurlyeq":"≽","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","sum":"∑","sung":"♪","sup":"⊃","sup1":"¹","sup2":"²","sup3":"³","supE":"⫆","supdot":"⪾","supdsub":"⫘","supe":"⊇","supedot":"⫄","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swArr":"⇙","swarhk":"⤦","swarr":"↙","swarrow":"↙","swnwar":"⤪","szli":"ß","szlig":"ß","target":"⌖","tau":"τ","tbrk":"⎴","tcaron":"ť","tcedil":"ţ","tcy":"т","tdot":"⃛","telrec":"⌕","tfr":"𝔱","there4":"∴","therefore":"∴","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","thinsp":" ","thkap":"≈","thksim":"∼","thor":"þ","thorn":"þ","tilde":"˜","time":"×","times":"×","timesb":"⊠","timesbar":"⨱","timesd":"⨰","tint":"∭","toea":"⤨","top":"⊤","topbot":"⌶","topcir":"⫱","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","tscr":"𝓉","tscy":"ц","tshcy":"ћ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","uArr":"⇑","uHar":"⥣","uacut":"ú","uacute":"ú","uarr":"↑","ubrcy":"ў","ubreve":"ŭ","ucir":"û","ucirc":"û","ucy":"у","udarr":"⇅","udblac":"ű","udhar":"⥮","ufisht":"⥾","ufr":"𝔲","ugrav":"ù","ugrave":"ù","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","umacr":"ū","um":"¨","uml":"¨","uogon":"ų","uopf":"𝕦","uparrow":"↑","updownarrow":"↕","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","upsi":"υ","upsih":"ϒ","upsilon":"υ","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","uring":"ů","urtri":"◹","uscr":"𝓊","utdot":"⋰","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","uum":"ü","uuml":"ü","uwangle":"⦧","vArr":"⇕","vBar":"⫨","vBarv":"⫩","vDash":"⊨","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vcy":"в","vdash":"⊢","vee":"∨","veebar":"⊻","veeeq":"≚","vellip":"⋮","verbar":"|","vert":"|","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","vopf":"𝕧","vprop":"∝","vrtri":"⊳","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","vzigzag":"⦚","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","wedgeq":"≙","weierp":"℘","wfr":"𝔴","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","xfr":"𝔵","xhArr":"⟺","xharr":"⟷","xi":"ξ","xlArr":"⟸","xlarr":"⟵","xmap":"⟼","xnis":"⋻","xodot":"⨀","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrArr":"⟹","xrarr":"⟶","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","yacut":"ý","yacute":"ý","yacy":"я","ycirc":"ŷ","ycy":"ы","ye":"¥","yen":"¥","yfr":"𝔶","yicy":"ї","yopf":"𝕪","yscr":"𝓎","yucy":"ю","yum":"ÿ","yuml":"ÿ","zacute":"ź","zcaron":"ž","zcy":"з","zdot":"ż","zeetrf":"ℨ","zeta":"ζ","zfr":"𝔷","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ }),

/***/ 3580:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0":"�","128":"€","130":"‚","131":"ƒ","132":"„","133":"…","134":"†","135":"‡","136":"ˆ","137":"‰","138":"Š","139":"‹","140":"Œ","142":"Ž","145":"‘","146":"’","147":"“","148":"”","149":"•","150":"–","151":"—","152":"˜","153":"™","154":"š","155":"›","156":"œ","158":"ž","159":"Ÿ"}');

/***/ }),

/***/ 2930:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('["cent","copy","divide","gt","lt","not","para","times"]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = __nccwpck_require__(7147);
const { URL } = __nccwpck_require__(7310);
const core = __nccwpck_require__(2186);
const remark = __nccwpck_require__(2081);
const visit = __nccwpck_require__(199);

const TEST_URL_ORIGIN = "https://test.com";
const LEARN_HOSTNAME = "learn.hashicorp.com";
const DEV_DOT_HOSTNAME = "developer.hashicorp.com";

const PRODUCT_SLUGS_TO_HOST_NAMES = {
  boundary: "boundaryproject.io",
  consul: "consul.io",
  hcp: "cloud.hashicorp.com",
  nomad: "nomadproject.io",
  packer: "packer.io",
  terraform: "terraform.io",
  vagrant: "vagrantup.com",
  vault: "vaultproject.io",
  waypoint: "waypointproject.io",
};

const PRODUCT_SLUGS_TO_BASE_PATHS = {
  boundary: ["docs", "api-docs", "downloads"],
  consul: ["docs", "api-docs", "commands", "downloads"],
  hcp: ["docs", "api-docs"],
  nomad: ["docs", "api-docs", "plugins", "tools", "intro", "downloads"],
  packer: ["docs", "guides", "intro", "plugins", "downloads"],
  terraform: [
    "cdktf",
    "cli",
    "cloud-docs",
    "cloud-docs/agents",
    "docs",
    "enterprise",
    "internals",
    "intro",
    "language",
    "plugin",
    "plugin/framework",
    "plugin/log",
    "plugin/mux",
    "plugin/sdkv2",
    "registry",
    "downloads",
  ],
  vagrant: ["docs", "intro", "vagrant-cloud", "vmware", "downloads"],
  vault: ["docs", "api-docs", "intro", "downloads", "downloads"],
  waypoint: ["commands", "docs", "plugins", "downloads"],
};

const linkFormatCheckerPlugin = () => {
  return async function transformer(tree, file) {
    return visit(tree, ["link", "definition"], (node) => {
      const thisLinksErrors = [];
      const urlObject = new URL(node.url, TEST_URL_ORIGIN);
      const { hostname, pathname, search = "", hash = "" } = urlObject;
      const isRelativePath = hostname === TEST_URL_ORIGIN

      // Set up `linksToErrors` map
      const data = file.data;
      if (!data.linksToErrors) {
        data.linksToErrors = {};
      }

      // Check for .io hostname
      const dotIoLinkProductSlug = Object.keys(
        PRODUCT_SLUGS_TO_HOST_NAMES
      ).find((productSlug) => {
        return (
          hostname === PRODUCT_SLUGS_TO_HOST_NAMES[productSlug] ||
          hostname === `www.${PRODUCT_SLUGS_TO_HOST_NAMES[productSlug]}`
        );
      });
      if (dotIoLinkProductSlug) {
        const devDotBasePaths =
          PRODUCT_SLUGS_TO_BASE_PATHS[dotIoLinkProductSlug];
        const isDevDotBasePath =
          pathname === "/" ||
          devDotBasePaths.some((devDotBasePath) => {
            return pathname.startsWith(`/${devDotBasePath}`);
          });
        if (isDevDotBasePath) {
          thisLinksErrors.push(
            `Old .io link: \`${
              node.url
            }\`. Try replacing it with: \`${`/${dotIoLinkProductSlug}${
              pathname === "/" ? "" : pathname
            }`}\`.`
          );
        }
      }

      // Check for learn hostname
      if (hostname === LEARN_HOSTNAME) {
        thisLinksErrors.push(
          `Old \`learn.hashicorp.com\` domain link: \`${node.url}\`. Replace it with a relative path internal to Dev Dot.`
        );
      }

      // Check for developer hostname
      if (hostname === DEV_DOT_HOSTNAME) {
        thisLinksErrors.push(
          `Full \`developer.hashicorp.com\` domain link: \`${node.url}\`. Replace with a relative path internal to Dev Dot. Possibly: \`${pathname}${search}${hash}\`.`
        );
      }

      // Check if old search link (starts with "/search")
      if (pathname.startsWith("/search") && (hostname === LEARN_HOSTNAME || isRelativePath)) {
        thisLinksErrors.push(
          `Old search page link: \`${node.url}\`. Replace it with \`/tutorials/library${search}${hash}\`.`
        );
      }

      // Check if one of old collection links
      if (
        pathname.startsWith("/collections/well-architected-framework") ||
        pathname.startsWith("/collections/onboarding")
      ) {
        thisLinksErrors.push(
          `Old waf/onboarding collection page link: \`${node.url}\`. WAF/onboarding collection links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}\``
        );
      } else if (pathname.startsWith("/collections")) {
        thisLinksErrors.push(
          `Old collection page link: \`${node.url}\`. Collections links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}\`.`
        );
      }

      // Check if one of old tutorial links
      if (
        pathname.startsWith("/tutorials/well-architected-framework") ||
        pathname.startsWith("/tutorials/onboarding")
      ) {
        thisLinksErrors.push(
          `Old waf/onboarding tutorials page link: \`${node.url}\`. WAF/onboarding tutorial links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}/{tutorialSlug}\``
        );
      } else if (pathname.startsWith("/tutorials")) {
        thisLinksErrors.push(
          `Old tutorial page link: \`${node.url}\`. Tutorials links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}\`.`
        );
      }

      // If a link has error(s), put them in the `linksToErrors` map
      // A single link can have multiple errors
      if (thisLinksErrors.length > 0) {
        data.linksToErrors[node.url] = thisLinksErrors;
      }
    });
  };
};

const checkForLegacyLinkFormatErrors = async (filePaths) => {
  const errors = {};

  console.log(`\nChecking "filePaths": ${JSON.stringify(filePaths, null, 2)}\n`)
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    if (fs.existsSync(filePath)) {
      console.log(`checking "${filePath}" for errors`)
      const rawMarkdownContent = String(fs.readFileSync(filePath, "utf-8"));
      const {
        data: { linksToErrors = {} },
      } = await remark().use(linkFormatCheckerPlugin).process(rawMarkdownContent);

      if (Object.keys(linksToErrors).length > 0) {
        errors[filePath] = linksToErrors;
      }
    } else {
      console.log(`skipping "${filePath}"; file does not exist`)
    }
  }

  return errors;
};

const main = async () => {
  try {
    const filePaths = process.env.FILE_PATHS?.split(/\s/).filter(filePath => {
      return filePath.startsWith('content/tutorials') && filePath.endsWith('.mdx')
    }) ?? [];
    const allErrors = await checkForLegacyLinkFormatErrors(filePaths);
    const filesWithErrors = Object.keys(allErrors);

    let commentBody = "";
    if (process.env.COMMENT_BODY_PREFIX) {
      commentBody += `${process.env.COMMENT_BODY_PREFIX}\n\n`;
    }

    if (filesWithErrors.length > 0) {
      core.setOutput("check-legacy-links-format-found-errors", true);
      commentBody += `Found legacy link format errors in ${filesWithErrors.length} file(s) :red_circle:\n\n`;

      filesWithErrors.forEach((filePath) => {
        const fileErrors = allErrors[filePath];
        const linksWithErrors = Object.keys(fileErrors);
        commentBody += `- ${linksWithErrors.length} link(s) with error(s) in \`${filePath}\`\n`;

        linksWithErrors.forEach((link) => {
          const linkErrors = fileErrors[link];
          commentBody += `  - ${linkErrors.length} error(s) for \`${link}\`\n`;

          linkErrors.forEach((linkError) => {
            commentBody += `    - ${linkError}\n`;
          });
        });
      });
    } else {
      core.setOutput("check-legacy-links-format-found-errors", false);
      commentBody += "No legacy link format errors found! :white_check_mark:";
    }

    core.setOutput("comment-body", commentBody);
  } catch (e) {
    core.setFailed(`Error in executing \`check-legacy-links-format\`: ${e}`);
  }
};

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;