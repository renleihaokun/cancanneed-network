var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/services/isp.ts
var CHINA_TELECOM_ASNS = [4134, 4809, 4811, 4812, 4813, 4814, 4815, 4816];
var CHINA_UNICOM_ASNS = [4837, 9929, 10099, 17621, 17622, 17623];
var CHINA_MOBILE_ASNS = [9808, 56040, 56041, 56042, 56044, 56046, 56047, 56048];
function identifyISP(rawIsp, asn) {
  const isp = rawIsp.toLowerCase();
  const defaultResult = {
    name: rawIsp || "\u672A\u77E5\u7F51\u7EDC",
    color: "#555555",
    bg: "rgba(85, 85, 85, 0.1)"
  };
  if (CHINA_TELECOM_ASNS.includes(asn) || isp.includes("chinanet") || isp.includes("telecom")) {
    return { name: "\u4E2D\u56FD\u7535\u4FE1", color: "#0066CC", bg: "rgba(0, 102, 204, 0.1)" };
  }
  if (CHINA_UNICOM_ASNS.includes(asn) || isp.includes("unicom")) {
    return { name: "\u4E2D\u56FD\u8054\u901A", color: "#E60012", bg: "rgba(230, 0, 18, 0.1)" };
  }
  if (CHINA_MOBILE_ASNS.includes(asn) || isp.includes("cmcc") || isp.includes("tietong")) {
    return { name: "\u4E2D\u56FD\u79FB\u52A8", color: "#0085D0", bg: "rgba(0, 133, 208, 0.1)" };
  }
  if (isp.includes("broadnet") || isp.includes("cable") || isp.includes("gehua")) {
    return { name: "\u4E2D\u56FD\u5E7F\u7535", color: "#7CB342", bg: "rgba(124, 179, 66, 0.15)" };
  }
  if (isp.includes("cernet")) {
    return { name: "\u4E2D\u56FD\u6559\u80B2\u7F51", color: "#00A0E9", bg: "rgba(0, 160, 233, 0.1)" };
  }
  if (isp.includes("dr.peng") || isp.includes("great wall")) {
    return { name: "\u957F\u57CE/\u9E4F\u535A\u58EB", color: "#E85928", bg: "rgba(232, 89, 40, 0.1)" };
  }
  if (isp.includes("hkt") || isp.includes("pccw")) {
    return { name: "HKT (\u9999\u6E2F\u7535\u8BAF)", color: "#00539F", bg: "rgba(0, 83, 159, 0.1)" };
  }
  if (isp.includes("hkbn")) {
    return { name: "HKBN (\u9999\u6E2F\u5BBD\u9891)", color: "#743C8F", bg: "rgba(116, 60, 143, 0.1)" };
  }
  if (isp.includes("hgc")) {
    return { name: "HGC", color: "#E3007F", bg: "rgba(227, 0, 127, 0.1)" };
  }
  if (isp.includes("cmhk")) {
    return { name: "CMHK", color: "#0085D0", bg: "rgba(0, 133, 208, 0.1)" };
  }
  if (isp.includes("ctm")) {
    return { name: "CTM (\u6FB3\u95E8\u7535\u8BAF)", color: "#00A651", bg: "rgba(0, 166, 81, 0.1)" };
  }
  if (isp.includes("chunghwa") || isp.includes("hinet")) {
    return { name: "\u4E2D\u534E\u7535\u4FE1 (HiNet)", color: "#2E57A6", bg: "rgba(46, 87, 166, 0.1)" };
  }
  if (isp.includes("alibaba") || isp.includes("aliyun")) {
    return { name: "\u963F\u91CC\u4E91", color: "#FF6A00", bg: "rgba(255, 106, 0, 0.1)" };
  }
  if (isp.includes("tencent")) {
    return { name: "\u817E\u8BAF\u4E91", color: "#0052D9", bg: "rgba(0, 82, 217, 0.1)" };
  }
  if (isp.includes("huawei")) {
    return { name: "\u534E\u4E3A\u4E91", color: "#C7000B", bg: "rgba(199, 0, 11, 0.1)" };
  }
  if (isp.includes("google") && !isp.includes("google cloud")) {
    return { name: "Google", color: "#4285F4", bg: "rgba(66, 133, 244, 0.1)" };
  }
  if (isp.includes("google cloud") || isp.includes("gcp")) {
    return { name: "Google Cloud", color: "#4285F4", bg: "rgba(66, 133, 244, 0.1)" };
  }
  if (isp.includes("amazon") || isp.includes("aws")) {
    return { name: "AWS", color: "#FF9900", bg: "rgba(255, 153, 0, 0.1)" };
  }
  if (isp.includes("microsoft") || isp.includes("azure")) {
    return { name: "Microsoft Azure", color: "#0078D4", bg: "rgba(0, 120, 212, 0.1)" };
  }
  if (isp.includes("oracle")) {
    return { name: "Oracle Cloud", color: "#C74634", bg: "rgba(199, 70, 52, 0.1)" };
  }
  if (isp.includes("digitalocean")) {
    return { name: "DigitalOcean", color: "#0080FF", bg: "rgba(0, 128, 255, 0.1)" };
  }
  if (isp.includes("vultr")) {
    return { name: "Vultr", color: "#0057E7", bg: "rgba(0, 87, 231, 0.1)" };
  }
  if (isp.includes("linode")) {
    return { name: "Linode", color: "#02B159", bg: "rgba(2, 177, 89, 0.1)" };
  }
  if (isp.includes("cloudflare")) {
    return { name: "Cloudflare WARP", color: "#F38020", bg: "rgba(243, 128, 32, 0.1)" };
  }
  return defaultResult;
}
__name(identifyISP, "identifyISP");

// src/services/colo.ts
var COLO_MAP = {
  HKG: { name: "\u9999\u6E2F", iso: "hk" },
  TPE: { name: "\u53F0\u5317", iso: "tw" },
  NRT: { name: "\u4E1C\u4EAC", iso: "jp" },
  KIX: { name: "\u5927\u962A", iso: "jp" },
  ICN: { name: "\u9996\u5C14", iso: "kr" },
  SIN: { name: "\u65B0\u52A0\u5761", iso: "sg" },
  KUL: { name: "\u5409\u9686\u5761", iso: "my" },
  BKK: { name: "\u66FC\u8C37", iso: "th" },
  SGN: { name: "\u80E1\u5FD7\u660E\u5E02", iso: "vn" },
  MNL: { name: "\u9A6C\u5C3C\u62C9", iso: "ph" },
  LAX: { name: "\u6D1B\u6749\u77F6", iso: "us" },
  SJC: { name: "\u5723\u4F55\u585E", iso: "us" },
  SFO: { name: "\u65E7\u91D1\u5C71", iso: "us" },
  SEA: { name: "\u897F\u96C5\u56FE", iso: "us" },
  JFK: { name: "\u7EBD\u7EA6", iso: "us" },
  LHR: { name: "\u4F26\u6566", iso: "gb" },
  FRA: { name: "\u6CD5\u5170\u514B\u798F", iso: "de" },
  AMS: { name: "\u963F\u59C6\u65AF\u7279\u4E39", iso: "nl" },
  SYD: { name: "\u6089\u5C3C", iso: "au" }
};
function translateColo(coloCode) {
  const code = coloCode.toUpperCase();
  return COLO_MAP[code] || { name: code, iso: null };
}
__name(translateColo, "translateColo");

// src/utils/response.ts
function errorResponse(c, message, status = 500) {
  console.error(`[Error] ${message}`);
  return c.json({ error: message }, status);
}
__name(errorResponse, "errorResponse");
function successResponse(c, data) {
  return c.json(data);
}
__name(successResponse, "successResponse");

// src/handlers/ip.ts
async function getIPInfo(c) {
  const request = c.req.raw;
  const cf = request.cf || {};
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const colo = cf.colo || "UNK";
  const rawIsp = cf.asOrganization || "";
  const asn = cf.asn || 0;
  const nodeInfo = translateColo(colo);
  const ispInfo = identifyISP(rawIsp, asn);
  const data = {
    ip,
    location: {
      country: cf.country || "",
      region: cf.region || "",
      city: cf.city || ""
    },
    node: {
      code: colo,
      name: nodeInfo.name,
      iso: nodeInfo.iso
    },
    asn,
    isp: {
      name: ispInfo.name,
      raw: rawIsp
    },
    rtt: Number(cf.clientTcpRtt) || 0
  };
  return successResponse(c, data);
}
__name(getIPInfo, "getIPInfo");

// src/handlers/ping.ts
async function ping(c) {
  console.log("[Ping] Health check");
  return new Response("pong", {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(ping, "ping");

// src/utils/speed-locale-maps.ts
var SPEED_REGION_ZH = {
  Africa: "\u975E\u6D32",
  "Asia Pacific": "\u4E9A\u6D32",
  Europe: "\u6B27\u6D32",
  "Middle East": "\u4E2D\u4E1C",
  "North America": "\u5317\u7F8E\u6D32",
  Oceania: "\u5927\u6D0B\u6D32",
  "South America": "\u5357\u7F8E\u6D32"
};
var SPEED_CITY_ZH_1 = {
  Abidjan: "\u963F\u6BD4\u8BA9",
  Accra: "\u963F\u514B\u62C9",
  Adelaide: "\u963F\u5FB7\u83B1\u5FB7",
  Ahmedabad: "\u827E\u54C8\u8FC8\u8FBE\u5DF4\u5FB7",
  Albuquerque: "\u963F\u5C14\u4F2F\u514B\u57FA",
  Algiers: "\u963F\u5C14\u53CA\u5C14",
  Almaty: "\u963F\u62C9\u6728\u56FE",
  Americana: "\u963F\u9ED8\u91CC\u5361",
  Amman: "\u5B89\u66FC",
  Amsterdam: "\u963F\u59C6\u65AF\u7279\u4E39",
  Anchorage: "\u5B89\u514B\u96F7\u5947",
  Annaba: "\u963F\u7EB3\u5DF4",
  Annabah: "\u5B89\u7EB3\u5DF4",
  Antananarivo: "\u5854\u90A3\u90A3\u5229\u4F5B",
  Aracatuba: "\u963F\u62C9\u5361\u56FE\u5DF4",
  Arica: "\u4E9A\u5229\u52A0",
  Ashburn: "\u963F\u4EC0\u672C",
  ASTANA: "\u963F\u65AF\u5854\u7EB3",
  Astara: "\u963F\u65AF\u5854\u62C9",
  "Asunci\xF3n": "\u4E9A\u677E\u68EE",
  Asuncion: "\u4E9A\u677E\u68EE",
  Athens: "\u96C5\u5178",
  Atlanta: "\u4E9A\u7279\u5170\u5927",
  Auckland: "\u5965\u514B\u5170",
  Austin: "\u5965\u65AF\u6C40",
  Baghdad: "\u5DF4\u683C\u8FBE",
  Baku: "\u5DF4\u5E93",
  "Bandar Seri Begawan": "\u65AF\u91CC\u6C99\u4E39\u6E2F",
  Bangalore: "\u73ED\u52A0\u7F57\u5C14",
  Bangkok: "\u66FC\u8C37",
  Bangor: "\u73ED\u6208",
  Barcelona: "\u5DF4\u585E\u7F57\u90A3",
  Barranquilla: "\u5DF4\u5170\u57FA\u4E9A",
  Basra: "\u5DF4\u58EB\u62C9",
  Beirut: "\u8D1D\u9C81\u7279",
  "Bel\xE9m": "\u8D1D\u4F26",
  Belem: "\u8D1D\u4F26",
  Belgrade: "\u8D1D\u5C14\u683C\u83B1\u5FB7",
  Belgrad: "\u8D1D\u5C14\u683C\u83B1\u5FB7",
  "Belo Horizonte": "\u8D1D\u6D1B\u5965\u91CC\u85CF\u7279",
  Berlin: "\u67CF\u6797",
  Bhubaneswar: "\u5E03\u8D6B\u74E6\u5185\u65AF\u74E6\u5C14",
  Blumenau: "\u5E03\u5362\u6885\u7459",
  Bogota: "\u6CE2\u54E5\u5927",
  Bordeaux: "\u6CE2\u5C14\u591A",
  "Bordeaux/Merignac": "\u6CE2\u5C14\u591A",
  Boston: "\u6CE2\u58EB\u987F",
  Brasilia: "\u5DF4\u897F\u5229\u4E9A",
  Bratislava: "\u5E03\u62C9\u8FEA\u65AF\u62C9\u53D1",
  Bridgetown: "\u5E03\u91CC\u5947\u6566",
  Brisbane: "\u5E03\u91CC\u65AF\u73ED",
  Brussels: "\u5E03\u9C81\u585E\u5C14",
  Bucharest: "\u5E03\u52A0\u52D2\u65AF\u7279",
  Budapest: "\u5E03\u8FBE\u4F69\u65AF",
  "Buenos Aires": "\u5E03\u5B9C\u8BFA\u65AF\u827E\u5229\u65AF",
  Buffalo: "\u6C34\u725B\u57CE",
  "C\xF3rdoba": "\u79D1\u5C14\u591A\u74E6",
  Cordoba: "\u79D1\u5C14\u591A\u74E6",
  Cacador: "\u5361\u5361\u591A",
  "Cagayan de Oro": "\u5361\u52A0\u5EF6\u5FB7\u5965\u7F57",
  Cairo: "\u5F00\u7F57",
  Calgary: "\u5361\u5C14\u52A0\u91CC",
  Campinas: "\u574E\u76AE\u7EB3\u65AF",
  "Campos dos Goytacazes": "\u574E\u6CE2\u65AF\u5FB7\u6208\u4F0A\u5854\u5361\u6CFD\u65AF",
  Canberra: "\u582A\u57F9\u62C9",
  "Cape Town": "\u5F00\u666E\u6566",
  Cebu: "\u5BBF\u96FE",
  Chandigarh: "\u94B1\u8FEA\u52A0\u5C14",
  Chapeco: "\u67E5\u4F69\u79D1",
  Charlotte: "\u590F\u6D1B\u7279",
  Chennai: "\u91D1\u5948",
  "Chiang Mai": "\u6E05\u8FC8",
  Chicago: "\u829D\u52A0\u54E5",
  "Chi\u0219in\u0103u": "\u57FA\u5E0C\u8A25\u4E4C",
  Chittagong: "\u9F50\u5854\u8D21",
  Christchurch: "\u514B\u8D56\u65AF\u7279\u5F7B\u5947",
  Cleveland: "\u514B\u5229\u592B\u5170",
  Colombo: "\u79D1\u4F26\u5761",
  Columbus: "\u54E5\u4F26\u5E03",
  Copenhagen: "\u54E5\u672C\u54C8\u6839",
  Cork: "\u79D1\u514B",
  Cuiaba: "\u5E93\u4E9A\u5DF4",
  Curitiba: "\u5E93\u91CC\u8482\u5DF4",
  "D\xFCsseldorf": "\u675C\u585E\u5C14\u591A\u592B",
  Dusseldorf: "\u675C\u585E\u5C14\u591A\u592B",
  "Da Nang": "\u5C98\u6E2F",
  Dakar: "\u8FBE\u5580\u5C14",
  Dallas: "\u8FBE\u62C9\u65AF",
  "Dallas-Fort Worth": "\u8FBE\u62C9\u65AF",
  Dammam: "\u8FBE\u66FC",
  "Ad Dammam": "\u8FBE\u66FC",
  "Dar es Salaam": "\u8FBE\u7D2F\u65AF\u8428\u62C9\u59C6",
  Denpasar: "\u767B\u5E15\u8428",
  "Denpasar-Bali Island": "\u767B\u5E15\u8428",
  Denver: "\u4E39\u4F5B",
  Detroit: "\u5E95\u7279\u5F8B",
  Dhaka: "\u8FBE\u5361",
  Djibouti: "\u5409\u5E03\u63D0",
  "Djibouti City": "\u5409\u5E03\u63D0\u5E02",
  Doha: "\u591A\u54C8",
  Dubai: "\u8FEA\u62DC",
  Dublin: "\u90FD\u67CF\u6797",
  Durban: "\u5FB7\u73ED",
  Durham: "\u8FBE\u52D2\u59C6",
  Edinburgh: "\u7231\u4E01\u5821",
  Erbil: "\u57C3\u5C14\u6BD4\u52D2",
  Arbil: "\u57C3\u5C14\u6BD4\u52D2",
  Florianopolis: "\u5F17\u6D1B\u91CC\u4E9A\u8BFA\u6CE2\u5229\u65AF",
  Fortaleza: "\u798F\u5854\u96F7\u8428",
  Frankfurt: "\u6CD5\u5170\u514B\u798F",
  "Frankfurt-am-Main": "\u6CD5\u5170\u514B\u798F",
  Fukuoka: "\u798F\u5188",
  Gaborone: "\u54C8\u4F2F\u7F57\u5185",
  Geneva: "\u65E5\u5185\u74E6",
  Georgetown: "\u4E54\u6CBB\u6566",
  Goiania: "\u6208\u4E9A\u5C3C\u4E9A",
  Gothenburg: "\u54E5\u5FB7\u5821",
  Guadalajara: "\u74DC\u8FBE\u62C9\u54C8\u62C9",
  "Guatemala City": "\u5371\u5730\u9A6C\u62C9\u57CE",
  Guayaquil: "\u74DC\u4E9A\u57FA\u5C14",
  Hagatna: "\u963F\u52A0\u5C3C\u4E9A",
  Haifa: "\u6D77\u6CD5",
  Halifax: "\u54C8\u5229\u6CD5\u514B\u65AF",
  Hamburg: "\u6C49\u5821",
  Hanoi: "\u6CB3\u5185",
  Harare: "\u54C8\u62C9\u96F7",
  Helsinki: "\u8D6B\u5C14\u8F9B\u57FA",
  "Ho Chi Minh City": "\u80E1\u5FD7\u660E\u5E02",
  Hobart: "\u970D\u5DF4\u7279",
  "Hong Kong": "\u9999\u6E2F",
  Honolulu: "\u6A80\u9999\u5C71",
  Houston: "\u4F11\u65AF\u987F",
  Hyderabad: "\u6D77\u5F97\u62C9\u5DF4",
  Indianapolis: "\u5370\u7B2C\u5B89\u7EB3\u6CE2\u5229\u65AF",
  Islamabad: "\u4F0A\u65AF\u5170\u5821",
  Istanbul: "\u4F0A\u65AF\u5766\u5E03\u5C14",
  Itajai: "\u4F0A\u5854\u6770",
  Izmir: "\u4F0A\u5179\u5BC6\u5C14",
  Jacksonville: "\u6770\u514B\u900A\u7EF4\u5C14",
  Jakarta: "\u96C5\u52A0\u8FBE",
  Jashore: "\u52A0\u6C99",
  Jeddah: "\u5409\u8FBE",
  Johannesburg: "\u7EA6\u7FF0\u5185\u65AF\u5821",
  "Johor Bahru": "\u65B0\u5C71",
  Joinville: "\u82E5\u56E0\u7EF4\u5C14",
  "Juazeiro do Norte": "\u5317\u8339\u963F\u6CFD\u9C81",
  "Juazeiro Do Norte": "\u5317\u8339\u963F\u6CFD\u9C81",
  KAMPALA: "\u574E\u5E15\u62C9",
  Kampala: "\u574E\u5E15\u62C9",
  Kannur: "\u5EB7\u7EB3",
  Kanpur: "\u574E\u666E\u5C14",
  "Kansas City": "\u582A\u8428\u65AF\u57CE",
  "Kaohsiung City": "\u9AD8\u96C4\u5E02",
  Karachi: "\u5361\u62C9\u5947",
  Kathmandu: "\u52A0\u5FB7\u6EE1\u90FD",
  Kigali: "\u57FA\u52A0\u5229",
  Kingston: "\u91D1\u65AF\u6566",
  Kinshasa: "\u91D1\u6C99\u8428",
  Kochi: "\u79D1\u94A6",
  Cochin: "\u79D1\u94A6",
  Kolkata: "\u52A0\u5C14\u5404\u7B54"
};
var SPEED_CITY_ZH_2 = {
  Krasnoyarsk: "\u514B\u62C9\u65AF\u8BFA\u4E9A\u5C14\u65AF\u514B",
  "Kuala Lumpur": "\u5409\u9686\u5761",
  "Kuwait City": "\u79D1\u5A01\u7279\u57CE",
  Kyiv: "\u57FA\u8F85",
  Kiev: "\u57FA\u8F85",
  "La Paz": "\u62C9\u5DF4\u65AF",
  "La Paz / El Alto": "\u62C9\u5DF4\u65AF",
  Lagos: "\u62C9\u5404\u65AF",
  Lahore: "\u62C9\u5408\u5C14",
  "Las Vegas": "\u62C9\u65AF\u7EF4\u52A0\u65AF",
  Lima: "\u5229\u9A6C",
  Lisbon: "\u91CC\u65AF\u672C",
  London: "\u4F26\u6566",
  "Los Angeles": "\u6D1B\u6749\u77F6",
  Luanda: "\u7F57\u5B89\u8FBE",
  "Luxembourg City": "\u5362\u68EE\u5821\u5E02",
  Lyon: "\u91CC\u6602",
  Macau: "\u6FB3\u95E8",
  Madrid: "\u9A6C\u5FB7\u91CC",
  Male: "\u9A6C\u7D2F",
  Manama: "\u9EA6\u7EB3\u9EA6",
  Manaus: "\u9A6C\u7459\u65AF",
  Manchester: "\u66FC\u5F7B\u65AF\u7279",
  Mandalay: "\u7F05\u7538\u4EF0\u5149",
  Manila: "\u9A6C\u5C3C\u62C9",
  Maputo: "\u9A6C\u666E\u6258",
  Marseille: "\u9A6C\u8D5B",
  McAllen: "\u9EA6\u5361\u4F26",
  "Medell\xEDn": "\u9EA6\u5FB7\u6797",
  Melbourne: "\u58A8\u5C14\u672C",
  Memphis: "\u5B5F\u83F2\u65AF",
  "Mexico City": "\u58A8\u897F\u54E5\u57CE",
  Miami: "\u8FC8\u963F\u5BC6",
  Milan: "\u7C73\u5170",
  Minneapolis: "\u660E\u5C3C\u963F\u6CE2\u5229\u65AF",
  Minsk: "\u660E\u65AF\u514B",
  Mombasa: "\u8499\u5DF4\u8428",
  Montgomery: "\u8499\u54E5\u9A6C\u5229",
  "Montr\xE9al": "\u8499\u7279\u5229\u5C14",
  Montreal: "\u8499\u7279\u5229\u5C14",
  Moscow: "\u83AB\u65AF\u79D1",
  Mumbai: "\u5B5F\u4E70",
  Munich: "\u6155\u5C3C\u9ED1",
  Muscat: "\u9A6C\u65AF\u5580\u7279",
  Nagpur: "\u7EB3\u683C\u6D66\u5C14",
  Naqpur: "\u7EB3\u683C\u6D66\u5C14",
  Naha: "\u90A3\u9738",
  Nairobi: "\u5185\u7F57\u6BD5",
  Najaf: "\u7EB3\u6770\u592B",
  Nashville: "\u7EB3\u4EC0\u7EF4\u5C14",
  Nasiriyah: "\u7EB3\u897F\u91CC\u4E9A",
  Neuquen: "\u65B0\u5730",
  "New Delhi": "\u65B0\u5FB7\u91CC",
  Newark: "\u7EBD\u74E6\u514B",
  Nicosia: "\u5C3C\u79D1\u897F\u4E9A",
  Norfolk: "\u8BFA\u798F\u514B",
  Noumea: "\u52AA\u7F8E\u963F",
  "Oklahoma City": "\u4FC4\u514B\u62C9\u8377\u9A6C\u57CE",
  Omaha: "\u5965\u9A6C\u54C8",
  Oran: "\u5965\u5170",
  Osaka: "\u5927\u962A",
  Oslo: "\u5965\u65AF\u9646",
  Ottawa: "\u6E25\u592A\u534E",
  Ouagadougou: "\u74E6\u52A0\u675C\u53E4",
  Palermo: "\u5DF4\u52D2\u83AB",
  Palmas: "\u5E15\u5C14\u9A6C\u65AF",
  "Panama City": "\u5DF4\u62FF\u9A6C\u57CE",
  Paramaribo: "\u5E15\u62C9\u9A6C\u91CC\u535A",
  Paris: "\u5DF4\u9ECE",
  Patna: "\u5E15\u7279\u7EB3",
  Perth: "\u67CF\u65AF",
  Philadelphia: "\u8D39\u57CE",
  "Phnom Penh": "\u91D1\u8FB9",
  Phoenix: "\u51E4\u51F0\u57CE",
  Pittsburgh: "\u5339\u5179\u5821",
  "Port Louis": "\u8DEF\u6613\u6E2F",
  "Port of Spain": "\u897F\u73ED\u7259\u6E2F",
  Portland: "\u6CE2\u7279\u5170",
  "Porto Alegre": "\u6CE2\u5C14\u56FE\u963F\u83B1\u683C\u91CC",
  Prague: "\u5E03\u62C9\u683C",
  Queretaro: "\u514B\u96F7\u5854\u7F57",
  Quito: "\u57FA\u591A",
  Ramallah: "\u62C9\u9A6C\u62C9",
  Recife: "\u7D2F\u897F\u8153",
  "Reykjav\xEDk": "\u96F7\u514B\u96C5\u672A\u514B",
  "Ribeirao Preto": "\u91CC\u8D1D\u6717\u666E\u96F7\u56FE",
  Richmond: "\u91CC\u58EB\u6EE1",
  Riga: "\u91CC\u52A0",
  "Rio de Janeiro": "\u91CC\u7EA6\u70ED\u5185\u5362",
  "Rio De Janeiro": "\u91CC\u7EA6\u70ED\u5185\u5362",
  Riyadh: "\u5229\u96C5\u5F97",
  Rome: "\u7F57\u9A6C",
  "S\xE3o Jos\xE9 do Rio Preto": "\u666E\u96F7\u56FE\u6CB3\u7554\u5723\u82E5\u6CFD",
  "Sao Jose Do Rio Preto": "\u666E\u96F7\u56FE\u6CB3\u7554\u5723\u82E5\u6CFD",
  "S\xE3o Jos\xE9 dos Campos": "\u5723\u82E5\u6CFD\u591A\u65AF\u574E\u6CE2\u65AF",
  "Sao Jose Dos Campos": "\u5723\u82E5\u6CFD\u591A\u65AF\u574E\u6CE2\u65AF",
  "S\xE3o Paulo": "\u5723\u4FDD\u7F57",
  "Sao Paulo": "\u5723\u4FDD\u7F57",
  Sacramento: "\u8428\u514B\u62C9\u95E8\u6258",
  "Saint Petersburg": "\u5723\u5F7C\u5F97\u5821",
  "St. Petersburg": "\u5723\u5F7C\u5F97\u5821",
  "Saint-Denis": "\u5723\u4F46\u5C3C",
  "St Denis": "\u5723\u4F46\u5C3C",
  "Salt Lake City": "\u76D0\u6E56\u57CE",
  Salvador: "\u8428\u5C14\u74E6\u591A",
  "San Antonio": "\u5723\u5B89\u4E1C\u5C3C\u5965",
  "San Diego": "\u5723\u5730\u4E9A\u54E5",
  "San Francisco": "\u65E7\u91D1\u5C71",
  "San Jos\xE9": "\u5723\u4F55\u585E",
  "San Jose": "\u5723\u4F55\u585E",
  "San Juan": "\u5723\u80E1\u5B89",
  Santiago: "\u5723\u5730\u4E9A\u54E5",
  "Santiago de los Caballeros": "\u5723\u5730\u4E9A\u54E5\u5FB7\u6D1B\u65AF\u5361\u5DF4\u5217\u7F57\u65AF",
  "Santo Domingo": "\u5723\u591A\u660E\u5404",
  Saskatoon: "\u8428\u65AF\u5361\u901A",
  Seattle: "\u897F\u96C5\u56FE",
  Seoul: "\u9996\u5C14",
  Singapore: "\u65B0\u52A0\u5761",
  "Sioux Falls": "\u82CF\u798F\u5C14\u65AF",
  Skopje: "\u65AF\u79D1\u666E\u91CC",
  Sofia: "\u7D22\u975E\u4E9A",
  Sorocaba: "\u7D22\u7F57\u5361\u5DF4",
  "St. George's": "\u5723\u4E54\u6CBB",
  "St. Louis": "\u5723\u8DEF\u6613\u65AF",
  "St Louis": "\u5723\u8DEF\u6613\u65AF",
  Stockholm: "\u65AF\u5FB7\u54E5\u5C14\u6469",
  Stuttgart: "\u65AF\u56FE\u52A0\u7279",
  Sulaymaniyah: "\u82CF\u83B1\u66FC\u5C3C\u4E9A",
  "Surat Thani": "\u7D20\u53FB\u4ED6\u5C3C",
  Suva: "\u82CF\u74E6",
  Sydney: "\u6089\u5C3C",
  Tahiti: "\u5854\u5E0C\u63D0",
  Taipei: "\u53F0\u5317",
  Tallahassee: "\u5854\u62C9\u54C8\u897F",
  Tallinn: "\u5854\u6797",
  Tampa: "\u5766\u5E15",
  "Tarlac City": "\u5854\u5C14\u62C9\u514B\u5E02",
  Tashkent: "\u5854\u4EC0\u5E72",
  Tbilisi: "\u7B2C\u6BD4\u5229\u65AF",
  Tegucigalpa: "\u7279\u53E4\u897F\u52A0\u5C14\u5DF4",
  "Tel Aviv": "\u7279\u62C9\u7EF4\u592B",
  Thessaloniki: "\u585E\u8428\u6D1B\u5C3C\u57FA",
  Thimphu: "\u5EF7\u5E03",
  Timbo: "\u5EF7\u535A",
  Tirana: "\u5730\u62C9\u90A3",
  Tokyo: "\u4E1C\u4EAC",
  Toronto: "\u591A\u4F26\u591A",
  Tunis: "\u7A81\u5C3C\u65AF",
  Tver: "\u7279\u7EF4\u5C14",
  Uberlandia: "\u4E4C\u8D1D\u5170\u8FEA\u4E9A",
  Ulaanbaatar: "\u4E4C\u5170\u5DF4\u6258",
  "Ulan Bator": "\u4E4C\u5170\u5DF4\u6258",
  Vancouver: "\u6E29\u54E5\u534E",
  Vienna: "\u7EF4\u4E5F\u7EB3",
  Vientiane: "\u4E07\u8C61",
  Vilnius: "\u7EF4\u5C14\u7EBD\u65AF",
  Vitoria: "\u7EF4\u591A\u5229\u4E9A",
  Warsaw: "\u534E\u6C99",
  Windhoek: "\u6E29\u5F97\u548C\u514B",
  Winnipeg: "\u6E29\u5C3C\u4F2F",
  Yamoussoukro: "\u96C5\u7A46\u82CF\u79D1\u7F57",
  Yangon: "\u4EF0\u5149",
  Yekaterinburg: "\u53F6\u5361\u6377\u7433\u5821",
  Yerevan: "\u57C3\u91CC\u6E29",
  Yogyakarta: "\u65E5\u60F9",
  "Yogyakarta-Java Island": "\u65E5\u60F9",
  Zagreb: "\u8428\u683C\u52D2\u5E03",
  Zurich: "\u82CF\u9ECE\u4E16",
  Wroclaw: "\u5F17\u7F57\u8328\u74E6\u592B",
  Bishkek: "\u6BD4\u4EC0\u51EF\u514B",
  Aktyubinsk: "\u963F\u514B\u6258\u6BD4",
  "Addis Ababa": "\u4E9A\u65AF\u4E9A\u8D1D\u5DF4",
  "Malang-Java Island": "\u739B\u7405",
  Luqa: "\u5362\u52A0",
  Taipa: "\u6C39\u4ED4",
  Rionegro: "\u91CC\u5965\u5185\u683C\u7F57",
  "La Mesa": "\u62C9\u6885\u8428",
  "Raleigh/Durham": "\u7F57\u5229",
  Tocumen: "\u6258\u5E93\u95E8",
  Papeete: "\u5E15\u76AE\u63D0",
  Lilongwe: "\u5229\u9686\u572D",
  Lankaran: "\u8FDE\u79D1\u5170",
  Larnarca: "\u62C9\u7EB3\u5361",
  "Lapu-Lapu City": "\u62C9\u666E\u62C9\u666E",
  Navegantes: "\u7EB3\u97E6\u7518\u8482\u65AF",
  Mattanur: "\u9A6C\u5854\u52AA\u5C14",
  Coimbatore: "\u54E5\u5370\u62DC\u9640",
  Constantine: "\u541B\u58EB\u5766\u4E01",
  "Angeles City": "\u5B89\u5409\u5229\u65AF",
  Concepcion: "\u5EB7\u585E\u666E\u897F\u7FC1",
  Kuching: "\u53E4\u664B",
  Senai: "\u58EB\u4E43",
  Paro: "\u5E15\u7F57",
  Zandery: "\u6851\u5FB7\u8D56",
  Nausori: "\u7459\u7D22\u91CC"
};
var SPEED_CITY_ZH = {
  ...SPEED_CITY_ZH_1,
  ...SPEED_CITY_ZH_2
};
function localizeSpeedLocations(locations2) {
  if (!Array.isArray(locations2)) return locations2;
  for (const loc of locations2) {
    if (loc.region) {
      loc.region = SPEED_REGION_ZH[loc.region] || loc.region;
    }
    if (loc.city) {
      loc.city = SPEED_CITY_ZH[loc.city] || loc.city;
    }
  }
  return locations2;
}
__name(localizeSpeedLocations, "localizeSpeedLocations");

// src/handlers/speed.ts
var SPEED_MIN_BYTES = 1e6;
var SPEED_MAX_BYTES = 2e8;
function parseSpeedSizeParam(param) {
  const s = String(param || "").trim();
  if (!s) return 1e7;
  const match2 = s.match(/^(\d+)([a-z]{0,2})$/i);
  if (!match2) return null;
  const size = parseInt(match2[1], 10);
  if (!Number.isFinite(size) || size <= 0) return null;
  const unit = match2[2].toLowerCase();
  const multipliers = {
    k: 1e3,
    kb: 1e3,
    m: 1e6,
    mb: 1e6,
    g: 1e9,
    gb: 1e9
  };
  return size * (multipliers[unit] ?? 1);
}
__name(parseSpeedSizeParam, "parseSpeedSizeParam");
async function download(c) {
  console.log("[Speed] Download test started");
  const request = c.req.raw;
  const baseHeaders = {
    "Access-Control-Allow-Origin": "*"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...baseHeaders,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: baseHeaders
    });
  }
  const url = new URL(request.url);
  const rawBytes = url.searchParams.get("bytes");
  let bytes;
  if (rawBytes != null && rawBytes !== "") {
    bytes = parseInt(rawBytes, 10);
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return errorResponse(c, "bytes \u65E0\u6548", 400);
    }
  } else {
    const sizeParam = url.searchParams.get("size") || "10mb";
    const parsed = parseSpeedSizeParam(sizeParam);
    if (parsed == null) {
      return errorResponse(c, "size \u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u4F8B\u5982 10m\u300150mb\u30011g", 400);
    }
    bytes = parsed;
  }
  bytes = Math.min(Math.max(bytes, SPEED_MIN_BYTES), SPEED_MAX_BYTES);
  console.log(`[Speed] Downloading ${bytes} bytes`);
  const targetUrl = `https://speed.cloudflare.com/__down?bytes=${bytes}`;
  const headers = new Headers();
  headers.set("referer", "https://speed.cloudflare.com/");
  const upstream = await fetch(targetUrl, { method: "GET", headers, redirect: "follow" });
  if (!upstream.ok) {
    const errorText = await upstream.text();
    console.error(`[Speed] Upstream error: ${upstream.status}`);
    return new Response(errorText || "\u4E0A\u6E38\u6D4B\u901F\u6E90\u9519\u8BEF", {
      status: upstream.status,
      headers: { ...baseHeaders, "Cache-Control": "no-store" }
    });
  }
  const out = new Headers();
  const ct = upstream.headers.get("content-type");
  if (ct) out.set("content-type", ct);
  out.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  out.set("Access-Control-Allow-Origin", "*");
  console.log("[Speed] Download test completed");
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
__name(download, "download");
async function locations(c) {
  console.log("[Speed] Fetching locations");
  const baseHeaders = {
    "Access-Control-Allow-Origin": "*"
  };
  try {
    const response = await fetch("https://speed.cloudflare.com/locations", {
      headers: { referer: "https://speed.cloudflare.com/" }
    });
    if (!response.ok) {
      console.error(`[Speed] Locations fetch failed: ${response.status}`);
      return new Response(JSON.stringify({ error: "\u4E0A\u6E38 locations \u5931\u8D25" }), {
        status: 502,
        headers: { "Content-Type": "application/json;charset=UTF-8", ...baseHeaders }
      });
    }
    const locations2 = await response.json();
    localizeSpeedLocations(locations2);
    return new Response(JSON.stringify(locations2, null, 2), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "public, max-age=300",
        // M5 修复：缩短缓存时间到 5 分钟
        ...baseHeaders
      }
    });
  } catch (e) {
    console.error(`[Speed] Locations error: ${e.message}`);
    return new Response(
      JSON.stringify({ error: String(e && e.message ? e.message : e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json;charset=UTF-8", ...baseHeaders }
      }
    );
  }
}
__name(locations, "locations");

// src/handlers/ai.ts
var AI_API_TIMEOUT = 3e4;
async function analyze(c) {
  try {
    let userInfo;
    try {
      userInfo = await c.req.json();
      if (!userInfo || typeof userInfo !== "object" || Array.isArray(userInfo)) {
        return errorResponse(c, "\u65E0\u6548\u7684\u8BF7\u6C42\u6570\u636E\u683C\u5F0F", 400);
      }
    } catch {
      return errorResponse(c, "\u65E0\u6548\u7684 JSON \u683C\u5F0F", 400);
    }
    const apiKey = c.env.ZHIPU_API_KEY;
    if (!apiKey) {
      console.error("[AI] ZHIPU_API_KEY not configured");
      return errorResponse(c, "AI \u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528", 500);
    }
    const zhipuRequest = {
      model: "GLM-4-Flash-250414",
      messages: [
        {
          role: "user",
          content: `\u4F60\u662F\u4E00\u4E2A\u975E\u5E38"\u6709\u6897"\u7684\u7F51\u7EDC\u5206\u6790\u52A9\u624B\u3002\u8BF7\u6839\u636E\u4EE5\u4E0BJSON\u4FE1\u606F\uFF0C\u7528\u901A\u4FD7\u6613\u61C2\u3001\u6781\u5176\u4FCF\u76AE\u7684\u8BED\u8A00\uFF0C\u5BF9\u7528\u6237\u7684\u7F51\u7EDC\u60C5\u51B5\u8FDB\u884C\u4E00\u6BB5\u7B80\u77ED\u7684\u5206\u6790\u548C\u603B\u7ED3\u3002
          \u4F60\u7684\u5206\u6790\u8981"\u6709\u6001\u5EA6"\uFF0C\u53EF\u4EE5\u6839\u636E\u7528\u6237\u7684\u8FD0\u8425\u5546\uFF08ISP\uFF09\u7ED9\u51FA\u4E00\u4E9B\u6709\u8DA3\u7684\u5410\u69FD\u3002\u4E0D\u8981\u4F7F\u7528markdown\u8BED\u6CD5\u3002
          \u4FE1\u606F\u5982\u4E0B\uFF1A

${JSON.stringify(userInfo, null, 2)}`
        }
      ],
      stream: true,
      temperature: 1
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_API_TIMEOUT);
    let zhipuResponse;
    try {
      zhipuResponse = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(zhipuRequest),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!zhipuResponse.ok) {
      const errorText = await zhipuResponse.text();
      console.error(`[AI] Zhipu API error: ${zhipuResponse.status} ${errorText}`);
      return errorResponse(c, "AI \u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5", 502);
    }
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = zhipuResponse.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    c.executionCtx.waitUntil(
      (async () => {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let boundary;
            while ((boundary = buffer.indexOf("\n")) !== -1) {
              const line = buffer.substring(0, boundary).trim();
              buffer = buffer.substring(boundary + 1);
              if (line.startsWith("data: ")) {
                const jsonStr = line.substring(6);
                if (jsonStr.trim() === "[DONE]") continue;
                try {
                  const data = JSON.parse(jsonStr);
                  const content = data.choices[0]?.delta?.content || "";
                  if (content) {
                    await writer.write(encoder.encode(content));
                  }
                } catch {
                }
              }
            }
          }
        } catch (error) {
          console.error("[AI] Stream processing error:", error);
          await writer.abort(error);
        } finally {
          await writer.close();
        }
      })()
    );
    return new Response(readable, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  } catch (error) {
    console.error(`[AI] Error: ${error.message}`);
    return errorResponse(c, "AI \u5206\u6790\u670D\u52A1\u51FA\u73B0\u5F02\u5E38", 500);
  }
}
__name(analyze, "analyze");

// src/routes/api.ts
var api = new Hono2();
api.get("/ip", getIPInfo);
api.get("/ping", ping);
api.get("/speed/download", download);
api.get("/speed/locations", locations);
api.post("/analyze", analyze);
api.get("/legacy", (c) => {
  const action = c.req.query("act");
  console.log(`[Legacy Route] action: ${action}`);
  switch (action) {
    case "get_ip_info":
      return getIPInfo(c);
    case "ping":
      return ping(c);
    case "speed_down":
      return download(c);
    case "speed_locations":
      return locations(c);
    default:
      return c.json({ error: "Unknown action" }, 400);
  }
});
api.post("/legacy", async (c) => {
  const action = c.req.query("act");
  console.log(`[Legacy Route] POST action: ${action}`);
  if (action === "analyze") {
    return analyze(c);
  }
  return c.json({ error: "Unknown action" }, 400);
});
var api_default = api;

// src/routes/pages.ts
var pages = new Hono2();
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
__name(escapeHtml, "escapeHtml");
pages.get("/", (c) => {
  const action = c.req.query("act");
  if (action) {
    return c.redirect(`/api/legacy?act=${action}`, 302);
  }
  const request = c.req.raw;
  const cf = request.cf || {};
  const rawIsp = cf.asOrganization || "";
  const asn = cf.asn || 0;
  const city = cf.city || "\u5730\u7403\u67D0\u5904";
  const region = cf.region || "";
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const colo = cf.colo || "UNK";
  const nodeInfo = translateColo(colo);
  const escapedIso = nodeInfo.iso ? escapeHtml(nodeInfo.iso) : "";
  const escapedName = escapeHtml(nodeInfo.name);
  const escapedColo = escapeHtml(colo);
  let coloHtml = escapedName;
  if (nodeInfo.iso) {
    coloHtml = `<img src="https://flagcdn.com/w40/${escapedIso}.png" class="flag-img" alt="${escapedIso}"> ${escapedName} <span style="opacity:0.6">(${escapedColo})</span>`;
  } else {
    coloHtml = `${escapedName} <span style="opacity:0.6">(${escapedColo})</span>`;
  }
  let rtt = Number(cf.clientTcpRtt) || 0;
  let rttDisplay = rtt + " ms";
  let rttColor = "#10b981";
  let isHttp3 = false;
  if (rtt === 0) {
    isHttp3 = true;
    rttDisplay = `<span class="blink">\u6D4B\u901F\u4E2D...</span>`;
  } else {
    if (rtt > 350) rttColor = "#ef4444";
    else if (rtt > 150) rttColor = "#f59e0b";
  }
  const ispInfo = identifyISP(rawIsp, asn);
  const locationStr = [city, region].filter(Boolean).join(", ");
  const html = generateHTML({
    ip: escapeHtml(ip),
    ispInfo,
    locationStr: escapeHtml(locationStr),
    rttColor,
    rttDisplay,
    isHttp3,
    coloHtml,
    asn,
    rawIsp: escapeHtml(rawIsp),
    nodeInfo,
    colo: escapedColo
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300"
      // 5 分钟缓存
    }
  });
});
function generateHTML(data) {
  const {
    ip,
    ispInfo,
    locationStr,
    rttColor,
    rttDisplay,
    isHttp3,
    coloHtml,
    asn,
    rawIsp,
    nodeInfo,
    colo
  } = data;
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\u8BA9\u6211\u770B\u770B\u4F60\u7684\u7F51\uFF01</title>
    <link rel="icon" href="https://imgbed.haokun.me/file/1768399588443_00007.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        :root {
            --primary-color: #2b5876;
            --text-main: #333;
            --text-sub: #666;
            --bg-glass: rgba(255, 255, 255, 0.1);
            --border-glass: rgba(255, 255, 255, 0.6);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: url('https://elaina.haokun.me/') no-repeat center center fixed;
            background-size: cover;
            padding: 2rem 1rem;
            color: #555;
        }
        .decoration { position: absolute; border-radius: 50%; filter: blur(40px); z-index: 0; animation: float 6s ease-in-out infinite; }
        .circle-1 { width: 200px; height: 200px; background: rgba(255, 255, 255, 0.2); top: 10%; left: 20%; }
        .circle-2 { width: 300px; height: 300px; background: rgba(161, 239, 255, 0.2); bottom: 10%; right: 15%; animation-delay: -3s; }

        .card {
            position: relative; z-index: 1;
            background: var(--bg-glass);
            backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(25px);
            border: 1px solid var(--border-glass);
            padding: 2.5rem 2rem; border-radius: 24px;
            box-shadow: 0 15px 50px 0 rgba(0, 0, 0, 0.2);
            text-align: center; width: 480px; max-width: 100%;
            margin: 0;
            animation: fadeIn 0.8s ease-out;
        }
        h1 { font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem; }

        .isp-tag {
            display: inline-block; color: ${ispInfo.color}; background: ${ispInfo.bg};
            padding: 4px 12px; border-radius: 8px; font-family: monospace;
            font-size: 1.3em; font-weight: 800; margin-top: 5px;
            border: 1px solid ${ispInfo.color}20;
        }

        .info-box {
            margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.5);
            border-radius: 12px; font-size: 0.95rem; color: var(--text-sub);
            line-height: 1.6; text-align: left; border: 1px solid rgba(255,255,255,0.4);
        }
        .info-row {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 8px;
        }
        .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-weight: bold; color: #57606f; white-space: nowrap; margin-right: 15px; flex-shrink: 0; }
        .value { font-family: monospace; color: var(--text-main); text-align: right; word-break: break-word; display: flex; align-items: center; justify-content: flex-end; }
        .flag-img { width: 20px; height: auto; margin-right: 6px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); vertical-align: middle; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${rttColor}; margin-right: 6px; transition: background-color 0.3s; }

        .btn {
            display: inline-block; padding: 12px 24px;
            background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
            color: white; border-radius: 50px; text-decoration: none; font-weight: bold;
            box-shadow: 0 4px 15px rgba(43, 88, 118, 0.35); transition: 0.3s;
            margin-top: 10px; border: none; cursor: pointer;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(43, 88, 118, 0.5); }

        .ai-result {
            margin-top: 20px; padding: 15px;
            background: rgba(230, 245, 230, 0.7); border-radius: 12px;
            text-align: left; font-size: 0.9em; line-height: 1.6;
            color: var(--text-main); border: 1px solid #a8e063; animation: fadeIn 0.5s ease-out;
        }
        .ai-result .loading { color: #555; text-align: center; animation: jump 1s ease-in-out infinite; }
        .ai-result .error { color: #d9534f; font-weight: bold; }
        .signature-img { margin-top: 20px; max-width: 100%; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: block; margin-left: auto; margin-right: auto; }
        .blink { animation: blinker 1.5s linear infinite; }

        /* Canvas & Switcher */
        .chart-wrapper { margin-top: 10px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1; position: relative; }
        .chart-header {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.85em; color: #777; margin-bottom: 5px;
        }
        .chart-container {
            width: 100%; height: 90px;
            background: rgba(255,255,255,0.3); border-radius: 8px;
            position: relative; overflow: hidden;
            border: 1px solid rgba(255,255,255,0.2);
        }
        canvas { width: 100%; height: 100%; display: block; }

        .expand-btn {
            position: absolute; top: 4px; right: 4px; width: 22px; height: 22px;
            background: rgba(255,255,255,0.5); backdrop-filter: blur(2px);
            border-radius: 4px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            z-index: 10; transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1); color: #666;
        }
        .expand-btn:hover { background: #fff; transform: scale(1.1); color: var(--primary-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .expand-btn:active { transform: scale(0.9); background: rgba(255,255,255,0.9); }
        .expand-btn svg { width: 14px; height: 14px; fill: currentColor; }

        .speed-section {
            margin-top: 0;
            padding-top: 10px;
            text-align: left;
        }
        .speed-stat-size-row {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 12px;
            width: 100%;
        }
        .speed-main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .speed-section > .speed-download-head {
            margin-bottom: 6px;
        }
        .speed-download-head {
            justify-content: flex-start;
        }
        .speed-main {
            flex: 1;
            min-width: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .speed-main .speed-actions {
            margin-top: 8px;
            margin-bottom: 0;
        }
        .speed-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: flex-start;
        }
        .speed-start { margin-top: 0 !important; padding: 10px 18px !important; font-size: 0.88rem !important; }
        .speed-cancel {
            margin-top: 0 !important; padding: 10px 16px !important; font-size: 0.88rem !important;
            background: linear-gradient(135deg, #64748b 0%, #475569 100%) !important;
            box-shadow: 0 2px 10px rgba(71, 85, 105, 0.35) !important;
        }
        .speed-cancel:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
        .speed-stats {
            padding-top: 2px;
        }
        .speed-stat-line {
            display: flex; justify-content: space-between; align-items: center;
            padding: 5px 0; font-size: 0.95rem;
        }
        .speed-stat-line .label { font-weight: bold; color: #57606f; margin-right: 10px; }
        .speed-stat-line .value { font-family: monospace; color: var(--text-main); text-align: right; }
        .info-row-after-speed {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed #cbd5e1;
        }

        /* Modal */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; pointer-events: none;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }

        .modal-content {
            background: #fff; width: 90%; max-width: 900px; max-height: 85vh; height: 600px;
            border-radius: 16px; padding: 20px; position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
            transform: scale(0.8); opacity: 0;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
        }
        .modal-overlay.active .modal-content { transform: scale(1); opacity: 1; }

        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; flex-shrink: 0; }
        .modal-title { font-size: 1.2rem; font-weight: bold; color: var(--text-main); }
        .modal-close { cursor: pointer; font-size: 1.5rem; color: #999; line-height: 1; padding: 0 10px; transition: color 0.2s; }
        .modal-close:hover { color: #ef4444; }

        .modal-chart-box { flex: 1; width: 100%; position: relative; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee; min-height: 0; margin-bottom: 10px; display: flex; }
        .modal-stats { display: flex; gap: 20px; font-size: 0.9rem; color: var(--text-sub); flex-shrink: 0; padding-top: 5px; border-top: 1px dashed #eee; }
        .stat-item b { font-family: monospace; color: var(--primary-color); }

        /* Switch */
        .switch-container {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255, 255, 255, 0.4); border-radius: 20px;
            padding: 3px; margin-bottom: 8px; position: relative;
            border: 1px solid rgba(255,255,255,0.3); height: 32px; flex-shrink: 0;
        }
        .modal-content .switch-container { background: #f0f2f5; border: 1px solid #e1e4e8; margin-bottom: 15px; }
        .switch-option {
            flex: 1; text-align: center; z-index: 2; cursor: pointer;
            font-size: 0.75rem; color: var(--text-sub); font-weight: 600;
            transition: color 0.3s, transform 0.1s ease; user-select: none; line-height: 26px;
            display: flex; align-items: center; justify-content: center;
        }
        .switch-option i {
            font-size: 14px;
            margin-right: 4px;
        }
        .switch-option:active { transform: scale(0.9); }
        .switch-input { display: none; }
        .switch-glider {
            position: absolute; top: 3px; left: 3px; height: calc(100% - 6px);
            width: calc((100% - 6px) / 8); background: #fff; border-radius: 16px;
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            z-index: 1; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* Switch Logic */
        #s-opt-1:checked ~ .switch-glider { transform: translateX(0%); }
        #s-opt-2:checked ~ .switch-glider { transform: translateX(100%); }
        #s-opt-3:checked ~ .switch-glider { transform: translateX(200%); }
        #s-opt-4:checked ~ .switch-glider { transform: translateX(300%); }
        #s-opt-5:checked ~ .switch-glider { transform: translateX(400%); }
        #s-opt-6:checked ~ .switch-glider { transform: translateX(500%); }
        #s-opt-7:checked ~ .switch-glider { transform: translateX(600%); }
        #s-opt-8:checked ~ .switch-glider { transform: translateX(700%); }

        #m-opt-1:checked ~ .switch-glider { transform: translateX(0%); }
        #m-opt-2:checked ~ .switch-glider { transform: translateX(100%); }
        #m-opt-3:checked ~ .switch-glider { transform: translateX(200%); }
        #m-opt-4:checked ~ .switch-glider { transform: translateX(300%); }
        #m-opt-5:checked ~ .switch-glider { transform: translateX(400%); }
        #m-opt-6:checked ~ .switch-glider { transform: translateX(500%); }
        #m-opt-7:checked ~ .switch-glider { transform: translateX(600%); }
        #m-opt-8:checked ~ .switch-glider { transform: translateX(700%); }

        .switch-container.switch-vertical-speed {
            flex-direction: column;
            width: 56px;
            height: auto;
            align-self: stretch;
            margin-bottom: 0;
            flex-shrink: 0;
        }
        .switch-container.switch-vertical-speed .switch-option {
            flex: 1;
            line-height: 1.05;
            font-size: 0.7rem;
        }
        .switch-container.switch-vertical-speed .switch-glider {
            width: calc(100% - 6px);
            height: calc((100% - 6px) / 4);
            left: 3px;
            top: 3px;
        }
        #speedv25:checked ~ .switch-glider { transform: translateY(0%); }
        #speedv50:checked ~ .switch-glider { transform: translateY(100%); }
        #speedv100:checked ~ .switch-glider { transform: translateY(200%); }
        #speedv200:checked ~ .switch-glider { transform: translateY(300%); }

        input:checked + label { color: var(--primary-color); }
        input:checked + label[for$="-2"] { color: #FF6A00; } /* Blog Orange */
        input:checked + label[for$="-3"] { color: #E3007F; } /* Bilibili Pink */
        input:checked + label[for$="-4"] { color: #0078D4; } /* Microsoft Blue */
        input:checked + label[for$="-5"] { color: #1a1f71; } /* Visa Dark Blue */
        input:checked + label[for$="-6"] { color: #4285F4; } /* Google Blue */
        input:checked + label[for$="-7"] { color: #171a21; } /* Steam Black/Blue */
        input:checked + label[for$="-8"] { color: #F38020; } /* Cloudflare Orange */

        @keyframes blinker { 50% { opacity: 0.5; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    </style>
</head>
<body>
    <div class="decoration circle-1"></div>
    <div class="decoration circle-2"></div>
    <div class="card">
        <h1>\u5F53\u524D\u6D41\u91CF\u6765\u6E90</h1>
        <div class="isp-tag">${ispInfo.name}</div>
        <div class="info-box">
            <div class="info-row"><span class="label">\u5F53\u524D\u8FDE\u63A5\u4F7F\u7528\u7684IP</span> <span class="value">${ip}</span></div>
            <div class="info-row"><span class="label">IPv4 \u5730\u5740</span> <span class="value" id="ipv4-addr"><span class="blink">\u67E5\u8BE2\u4E2D...</span></span></div>
            <div class="info-row"><span class="label">IPv6 \u5730\u5740</span> <span class="value" id="ipv6-addr"><span class="blink">\u67E5\u8BE2\u4E2D...</span></span></div>
            <div class="info-row"><span class="label">CF\u5F52\u5C5E\u5730</span> <span class="value">${locationStr}</span></div>
            <div class="info-row"><span class="label">API\u5F52\u5C5E\u5730 (IPv4)</span> <span class="value" id="ext-loc">\u67E5\u8BE2\u4E2D...</span></div>

            <div class="info-row">
                <span class="label">\u8FDE\u63A5\u5EF6\u8FDF (\u63E1\u624B)</span>
                <span class="value" style="color:${rttColor}; font-weight:bold;" id="rtt-value">
                    <span class="status-dot" id="rtt-dot"></span>${rttDisplay}
                </span>
            </div>

            <div class="chart-wrapper">
                <div class="switch-container">
                    <input type="radio" id="s-opt-1" name="switch" class="switch-input" checked onchange="changePingTarget(1)">
                    <label for="s-opt-1" class="switch-option" title="\u672C\u7AD9">
                        <i class="fa-solid fa-house"></i>
                    </label>
                    <input type="radio" id="s-opt-2" name="switch" class="switch-input" onchange="changePingTarget(2)">
                    <label for="s-opt-2" class="switch-option" title="Blog">
                        <i class="fa-solid fa-book"></i>
                    </label>
                    <input type="radio" id="s-opt-3" name="switch" class="switch-input" onchange="changePingTarget(3)">
                    <label for="s-opt-3" class="switch-option" title="Bilibili">
                        <i class="fa-brands fa-bilibili"></i>
                    </label>
                    <input type="radio" id="s-opt-4" name="switch" class="switch-input" onchange="changePingTarget(4)">
                    <label for="s-opt-4" class="switch-option" title="Microsoft">
                        <i class="fa-brands fa-microsoft"></i>
                    </label>
                    <input type="radio" id="s-opt-5" name="switch" class="switch-input" onchange="changePingTarget(5)">
                    <label for="s-opt-5" class="switch-option" title="Visa">
                        <i class="fa-brands fa-cc-visa"></i>
                    </label>
                    <input type="radio" id="s-opt-6" name="switch" class="switch-input" onchange="changePingTarget(6)">
                    <label for="s-opt-6" class="switch-option" title="Google">
                        <i class="fa-brands fa-google"></i>
                    </label>
                    <input type="radio" id="s-opt-7" name="switch" class="switch-input" onchange="changePingTarget(7)">
                    <label for="s-opt-7" class="switch-option" title="Steam">
                        <i class="fa-brands fa-steam"></i>
                    </label>
                    <input type="radio" id="s-opt-8" name="switch" class="switch-input" onchange="changePingTarget(8)">
                    <label for="s-opt-8" class="switch-option" title="Cloudflare">
                        <i class="fa-brands fa-cloudflare"></i>
                    </label>
                    <div class="switch-glider"></div>
                </div>

                <div class="chart-header">
                    <span id="ping-target-name">\u7F51\u7EDC\u771F\u8FDE\u63A5\u8FDE\u901A\u6027 (\u672C\u7AD9)</span>
                    <span id="rt-ping-value" style="font-family:monospace; font-weight:bold;">-- ms</span>
                </div>

                <div class="chart-container">
                    <div class="expand-btn" onclick="openModal()" title="\u653E\u5927\u67E5\u770B\u8BE6\u7EC6\u5386\u53F2">
                        <svg viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zM9 21l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zM21 15l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"/></svg>
                    </div>
                    <canvas id="ping-chart"></canvas>
                </div>
            </div>

            <div class="speed-section">
                <div class="chart-header speed-download-head">
                    <span>\u4E0B\u8F7D\u5E26\u5BBD</span>
                </div>
                <div class="speed-main">
                        <div class="speed-stat-size-row">
                            <div class="switch-container switch-vertical-speed" title="\u6D4B\u901F\u4E0B\u8F7D\u91CF">
                                <input type="radio" id="speedv25" name="speed-size" class="switch-input" value="25m">
                                <label for="speedv25" class="switch-option">25M</label>
                                <input type="radio" id="speedv50" name="speed-size" class="switch-input" value="50m" checked>
                                <label for="speedv50" class="switch-option">50M</label>
                                <input type="radio" id="speedv100" name="speed-size" class="switch-input" value="100m">
                                <label for="speedv100" class="switch-option">100M</label>
                                <input type="radio" id="speedv200" name="speed-size" class="switch-input" value="200m">
                                <label for="speedv200" class="switch-option">200M</label>
                                <div class="switch-glider"></div>
                            </div>
                            <div class="speed-main-content">
                                <div class="speed-stats">
                                    <div class="speed-stat-line"><span class="label" id="speed-curr-label">\u5F53\u524D\u901F\u5EA6</span><span class="value" id="speed-current">\u2014</span></div>
                                    <div class="speed-stat-line"><span class="label">\u5168\u7A0B\u5E73\u5747</span><span class="value" id="speed-avg">\u2014</span></div>
                                </div>
                                <div class="speed-actions">
                                    <button type="button" class="btn speed-start" id="speed-start-btn">\u5F00\u59CB\u6D4B\u901F</button>
                                    <button type="button" class="btn speed-cancel" id="speed-cancel-btn" disabled>\u53D6\u6D88</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            <div class="info-row info-row-after-speed"><span class="label">\u63A5\u5165\u8282\u70B9</span> <span class="value">${coloHtml}</span></div>
            <div class="info-row"><span class="label">ASN\u7F16\u7801</span> <span class="value">AS${asn}</span></div>
            <div class="info-row"><span class="label">\u539F\u59CBISP</span> <span class="value" style="font-size:0.9em">${rawIsp}</span></div>
        </div>
        <a href="https://haokun.me" class="btn">\u524D\u5F80\u535A\u5BA2</a>
        <div id="ai-result-container" class="ai-result">
            <p class="loading">\u{1F916} AI \u6B63\u5728\u5206\u6790\u60A8\u7684\u7F51\u7EDC...</p>
        </div>
        <img src="https://tool.lu/netcard/" class="signature-img" alt="IP Signature">
    </div>

    <div class="modal-overlay" id="chart-modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modal-title-text">\u8BE6\u7EC6\u5EF6\u8FDF\u5386\u53F2\u8BB0\u5F55</div>
                <div class="modal-close" onclick="closeModal()">\xD7</div>
            </div>

            <div class="switch-container">
                <input type="radio" id="m-opt-1" name="modal-switch" class="switch-input" checked onchange="changePingTarget(1)">
                <label for="m-opt-1" class="switch-option"><i class="fa-solid fa-house"></i> \u672C\u7AD9</label>
                <input type="radio" id="m-opt-2" name="modal-switch" class="switch-input" onchange="changePingTarget(2)">
                <label for="m-opt-2" class="switch-option"><i class="fa-solid fa-book"></i> Blog</label>
                <input type="radio" id="m-opt-3" name="modal-switch" class="switch-input" onchange="changePingTarget(3)">
                <label for="m-opt-3" class="switch-option"><i class="fa-brands fa-bilibili"></i> Bilibili</label>
                <input type="radio" id="m-opt-4" name="modal-switch" class="switch-input" onchange="changePingTarget(4)">
                <label for="m-opt-4" class="switch-option"><i class="fa-brands fa-microsoft"></i> Msft</label>
                <input type="radio" id="m-opt-5" name="modal-switch" class="switch-input" onchange="changePingTarget(5)">
                <label for="m-opt-5" class="switch-option"><i class="fa-brands fa-cc-visa"></i> Visa</label>
                <input type="radio" id="m-opt-6" name="modal-switch" class="switch-input" onchange="changePingTarget(6)">
                <label for="m-opt-6" class="switch-option"><i class="fa-brands fa-google"></i> Google</label>
                <input type="radio" id="m-opt-7" name="modal-switch" class="switch-input" onchange="changePingTarget(7)">
                <label for="m-opt-7" class="switch-option"><i class="fa-brands fa-steam"></i> Steam</label>
                <input type="radio" id="m-opt-8" name="modal-switch" class="switch-input" onchange="changePingTarget(8)">
                <label for="m-opt-8" class="switch-option"><i class="fa-brands fa-cloudflare"></i> Cloudflare</label>
                <div class="switch-glider"></div>
            </div>

            <div class="modal-chart-box">
                <canvas id="large-ping-chart"></canvas>
            </div>
            <div class="modal-stats">
                <div class="stat-item">\u5F53\u524D: <b id="stat-curr">--</b> ms</div>
                <div class="stat-item">\u5E73\u5747: <b id="stat-avg">--</b> ms</div>
                <div class="stat-item">\u6700\u5927: <b id="stat-max">--</b> ms</div>
                <div class="stat-item">\u6700\u5C0F: <b id="stat-min">--</b> ms</div>
                <div class="stat-item">\u6296\u52A8: <b id="stat-jitter">--</b> ms</div>
                <div class="stat-item" style="margin-left:auto; font-size:0.8em; opacity:0.7">\u663E\u793A\u6700\u8FD1 200 \u6B21\u8BB0\u5F55</div>
            </div>
        </div>
    </div>

    <script>
        // === 1. IP & Geo ===
        async function fetchIpDetails() {
            fetch('https://ipv6.icanhazip.com').then(res => res.text()).then(ipv6 => {
                document.getElementById('ipv6-addr').innerText = ipv6.trim();
            }).catch(() => {
                document.getElementById('ipv6-addr').innerText = '\u4E0D\u53EF\u7528';
            });

            fetch('https://ipv4.icanhazip.com').then(res => res.text()).then(ipv4 => {
                const cleanIpv4 = ipv4.trim();
                document.getElementById('ipv4-addr').innerText = cleanIpv4;
                return cleanIpv4;
            }).then(ipv4 => {
                if (!ipv4) {
                    document.getElementById('ext-loc').innerText = '\u67E5\u8BE2\u5931\u8D25';
                    startAiAnalysis();
                    return;
                }
                fetch(\`https://ipapi.co/\${ipv4}/json/\`)
                    .then(r => r.json())
                    .then(d => {
                        const loc = [d.city, d.region, d.country_name].filter(Boolean).join(', ');
                        document.getElementById('ext-loc').innerText = loc || '\u672A\u77E5';
                    })
                    .catch(() => { document.getElementById('ext-loc').innerText = '\u67E5\u8BE2\u8D85\u65F6'; })
                    .finally(() => { startAiAnalysis(); });
            }).catch(() => {
                document.getElementById('ipv4-addr').innerText = '\u4E0D\u53EF\u7528';
                startAiAnalysis();
            });
        }
        fetchIpDetails();

        // === 2. Initial HTTP RTT ===
        const isHttp3 = ${isHttp3};
        function updateConnectionRttUI(duration, note) {
            const rttElem = document.getElementById('rtt-value');
            let color = "#10b981";
            if (duration > 350) color = "#ef4444";
            else if (duration > 150) color = "#f59e0b";

            rttElem.innerHTML = '<span class="status-dot" id="rtt-dot"></span>' + duration + ' ms <span style="font-size:0.8em;opacity:0.7">(' + note + ')</span>';
            rttElem.style.color = color;
            document.getElementById('rtt-dot').style.backgroundColor = color;
        }

        if (isHttp3) {
            const pingUrl = window.location.pathname + '?act=ping&t=' + Date.now();
            fetch(pingUrl).then(() => {
                const measureUrl = window.location.pathname + '?act=ping&t=' + (Date.now() + 1);
                const startTime = performance.now();
                fetch(measureUrl).then(() => {
                    const endTime = performance.now();
                    const entries = performance.getEntriesByName(measureUrl);
                    let duration = 0;
                    if (entries.length > 0) {
                        const entry = entries[entries.length - 1];
                        duration = Math.round(entry.responseStart - entry.requestStart);
                    } else {
                        duration = Math.round(endTime - startTime);
                    }
                    if (duration <= 0) duration = 1;
                    updateConnectionRttUI(duration, "HTTP/3");
                });
            });
        }

        // === 3. Real-time Ping Chart ===
        const smallCanvas = document.getElementById('ping-chart');
        const smallCtx = smallCanvas.getContext('2d');
        const largeCanvas = document.getElementById('large-ping-chart');
        const largeCtx = largeCanvas.getContext('2d');
        const rtValueElem = document.getElementById('rt-ping-value');
        const targetNameElem = document.getElementById('ping-target-name');
        const modal = document.getElementById('chart-modal');
        const modalTitle = document.getElementById('modal-title-text');

        const historyLimit = 200;
        const smallViewLimit = 50;
        let pingData = new Array(historyLimit).fill(0);
        let pingInterval = null;
        let isModalOpen = false;

        const pingTargets = {
            1: { name: '\u672C\u7AD9', url: window.location.pathname + '?act=ping', needCors: false },
            2: { name: 'Blog', url: 'https://haokun.me/', needCors: true },
            3: { name: 'Bilibili', url: 'https://www.bilibili.com/favicon.ico', needCors: true },
            4: { name: 'Microsoft', url: 'https://www.microsoft.com/favicon.ico', needCors: true },
            5: { name: 'Visa', url: 'https://www.visa.cn/favicon.ico', needCors: true },
            6: { name: 'Google', url: 'https://www.google.com/favicon.ico', needCors: true },
            7: { name: 'Steam', url: 'https://store.steampowered.com/favicon.ico', needCors: true },
            8: { name: 'Cloudflare', url: 'https://www.cloudflare.com/favicon.ico', needCors: true }
        };
        let currentTargetId = 1;

        window.changePingTarget = function(id) {
            currentTargetId = id;
            const name = pingTargets[id].name;
            targetNameElem.innerText = '\u7F51\u7EDC\u771F\u8FDE\u63A5\u8FDE\u901A\u6027 (' + name + ')';
            modalTitle.innerText = name + ' - \u8BE6\u7EC6\u5EF6\u8FDF\u5386\u53F2';
            document.getElementById('s-opt-' + id).checked = true;
            document.getElementById('m-opt-' + id).checked = true;
            pingData.fill(0);
            rtValueElem.innerText = '-- ms';
        }

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }

        function resizeCanvas(canvas, ctx) {
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.parentElement.clientWidth;
            const h = canvas.parentElement.clientHeight;
            if (!w || !h) return;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
        }

        window.openModal = function() {
            modal.classList.add('active');
            isModalOpen = true;
            setTimeout(() => {
                resizeCanvas(largeCanvas, largeCtx);
                drawCharts();
            }, 50);
        }
        window.closeModal = function() {
            modal.classList.remove('active');
            isModalOpen = false;
        }

        const handleResize = debounce(() => {
            resizeCanvas(smallCanvas, smallCtx);
            if (isModalOpen) resizeCanvas(largeCanvas, largeCtx);
            drawCharts();
        }, 200);
        window.addEventListener('resize', handleResize);

        resizeCanvas(smallCanvas, smallCtx);

        function renderLineChart(ctx, canvas, dataPoints, showGrid = false) {
            const w = canvas.parentElement.clientWidth;
            const h = canvas.parentElement.clientHeight;
            ctx.clearRect(0, 0, w, h);
            const validPoints = dataPoints.filter(p => p > 0);
            let maxVal = Math.max(100, ...validPoints);
            if (maxVal > 1000) maxVal = 2000;

            if (showGrid) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,0.05)';
                ctx.lineWidth = 1;
                for (let i = 1; i < 4; i++) {
                    const y = h - (i * 0.25 * h);
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                }
                ctx.stroke();
            }

            const count = dataPoints.length;
            const stepX = w / (count - 1);
            ctx.beginPath();
            for (let i = 0; i < count; i++) {
                const val = dataPoints[i];
                const x = i * stepX;
                const y = h - (val / maxVal) * (h * 0.85);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2b5876';
            ctx.stroke();

            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, 'rgba(43, 88, 118, 0.4)');
            grad.addColorStop(1, 'rgba(43, 88, 118, 0.0)');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        function updateStats(lastVal) {
            const valid = pingData.filter(x => x > 0);
            if (valid.length === 0) return;
            const min = Math.min(...valid);
            const max = Math.max(...valid);
            const avg = Math.round(valid.reduce((a,b)=>a+b,0) / valid.length);
            let sumDiff = 0;
            for (let i = 1; i < valid.length; i++) sumDiff += Math.abs(valid[i] - valid[i - 1]);
            const jitter = valid.length > 1 ? Math.round(sumDiff / (valid.length - 1)) : 0;
            document.getElementById('stat-curr').innerText = lastVal;
            document.getElementById('stat-avg').innerText = avg;
            document.getElementById('stat-max').innerText = max;
            document.getElementById('stat-min').innerText = min;
            document.getElementById('stat-jitter').innerText = jitter;
        }

        function drawCharts() {
            const smallData = pingData.slice(-smallViewLimit);
            renderLineChart(smallCtx, smallCanvas, smallData, false);
            if (isModalOpen) renderLineChart(largeCtx, largeCanvas, pingData, true);
        }

        async function doRealTimePing() {
            const start = performance.now();
            const target = pingTargets[currentTargetId];
            const separator = target.url.includes('?') ? '&' : '?';
            const url = target.url + separator + 'ts=' + Date.now();

            let dur = 0;
            try {
                const fetchOpts = { cache: 'no-store' };
                if (target.needCors) {
                    fetchOpts.mode = 'no-cors';
                    fetchOpts.method = 'HEAD';
                }
                await fetch(url, fetchOpts);
                dur = Math.round(performance.now() - start);

                if (dur > 300) rtValueElem.style.color = '#ef4444';
                else if (dur > 150) rtValueElem.style.color = '#f59e0b';
                else rtValueElem.style.color = '#10b981';
            } catch (e) {
                dur = 0;
                rtValueElem.style.color = '#aaa';
            }

            pingData.shift();
            pingData.push(dur);
            rtValueElem.innerText = (dur > 0 ? dur : '\u8D85\u65F6') + ' ms';
            if (isModalOpen) updateStats(dur);
            requestAnimationFrame(drawCharts);
        }

        function startMonitor() {
            if (pingInterval) clearInterval(pingInterval);
            doRealTimePing();
            pingInterval = setInterval(doRealTimePing, 1000);
        }
        function stopMonitor() {
            if (pingInterval) { clearInterval(pingInterval); pingInterval = null; }
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopMonitor(); else startMonitor();
        });
        startMonitor();

        // === 3b. \u4E0B\u8F7D\u5E26\u5BBD\uFF08Cloudflare __down \u7ECF\u672C\u7AD9\u4EE3\u7406\uFF09 ===
        (function () {
            const speedStart = document.getElementById('speed-start-btn');
            const speedCancel = document.getElementById('speed-cancel-btn');
            const speedSizeInputs = function () {
                return document.querySelectorAll('.switch-vertical-speed input[name="speed-size"]');
            };
            const elCur = document.getElementById('speed-current');
            const elAvg = document.getElementById('speed-avg');
            const elCurrLabel = document.getElementById('speed-curr-label');
            let speedController = null;

            function getSpeedSizeValue() {
                const el = document.querySelector('.switch-vertical-speed input[name="speed-size"]:checked');
                return el ? el.value : '50m';
            }
            function setSpeedSizeDisabled(disabled) {
                speedSizeInputs().forEach(function (inp) { inp.disabled = disabled; });
            }

            function fmtMbps(n) {
                if (!isFinite(n) || n <= 0) return '\u2014';
                if (n >= 1000) return (n / 1000).toFixed(2) + ' Gbps';
                return n.toFixed(1) + ' Mbps';
            }

            async function runSpeedTest() {
                if (speedController) return;
                speedController = new AbortController();
                speedStart.disabled = true;
                speedCancel.disabled = false;
                setSpeedSizeDisabled(true);
                if (elCurrLabel) elCurrLabel.textContent = '\u5F53\u524D\u901F\u5EA6';
                elCur.textContent = '\u8FDE\u63A5\u4E2D\u2026';
                elAvg.textContent = '\u2014';

                var size = getSpeedSizeValue();
                var url = window.location.pathname + '?act=speed_down&size=' + encodeURIComponent(size);
                var t0 = performance.now();
                var total = 0;
                var tMark = t0;
                var bMark = 0;
                var peak = 0;

                try {
                    var res = await fetch(url, { cache: 'no-store', signal: speedController.signal });
                    if (!res.ok) {
                        var err = 'HTTP ' + res.status;
                        try {
                            var j = await res.json();
                            if (j.error) err = j.error;
                        } catch (e1) {}
                        throw new Error(err);
                    }
                    var reader = res.body.getReader();
                    while (true) {
                        var chunk = await reader.read();
                        if (chunk.done) break;
                        var value = chunk.value;
                        total += value.byteLength;
                        var now = performance.now();
                        var dt = (now - tMark) / 1000;
                        var elapsedAll = (now - t0) / 1000;
                        if (elapsedAll >= 0.05) {
                            elAvg.textContent = fmtMbps(total * 8 / 1e6 / elapsedAll);
                        }
                        if (dt >= 0.25) {
                            var inst = (total - bMark) * 8 / 1e6 / dt;
                            if (inst > peak) peak = inst;
                            elCur.textContent = fmtMbps(inst);
                            tMark = now;
                            bMark = total;
                        }
                    }
                    var totalSec = (performance.now() - t0) / 1000;
                    var avg = totalSec > 0 ? total * 8 / 1e6 / totalSec : 0;
                    elAvg.textContent = fmtMbps(avg);
                    if (peak > 0) {
                        if (elCurrLabel) elCurrLabel.textContent = '\u5CF0\u503C\u901F\u5EA6';
                        elCur.textContent = fmtMbps(peak);
                    } else {
                        if (elCurrLabel) elCurrLabel.textContent = '\u5F53\u524D\u901F\u5EA6';
                        elCur.textContent = fmtMbps(avg);
                    }
                } catch (e) {
                    if (e.name === 'AbortError') {
                        elCur.textContent = '\u5DF2\u53D6\u6D88';
                        elAvg.textContent = '\u2014';
                        if (elCurrLabel) elCurrLabel.textContent = '\u5F53\u524D\u901F\u5EA6';
                    } else {
                        elCur.textContent = '\u5931\u8D25';
                        elAvg.textContent = e.message || String(e);
                        if (elCurrLabel) elCurrLabel.textContent = '\u5F53\u524D\u901F\u5EA6';
                    }
                } finally {
                    speedController = null;
                    speedStart.disabled = false;
                    speedCancel.disabled = true;
                    setSpeedSizeDisabled(false);
                }
            }

            speedStart.addEventListener('click', runSpeedTest);
            speedCancel.addEventListener('click', function () {
                if (speedController) speedController.abort();
            });
        })();

        // === 4. AI Analysis ===
        async function startAiAnalysis() {
            const aiResultContainer = document.getElementById('ai-result-container');
            const p = aiResultContainer.querySelector('p');
            let isFirstChunk = true;

            try {
                const userInfo = {
                    connection_ip: '${ip}',
                    ipv4_address: document.getElementById('ipv4-addr').innerText,
                    ipv6_address: document.getElementById('ipv6-addr').innerText,
                    isp: '${ispInfo.name}',
                    cf_location: '${locationStr}',
                    api_location: document.getElementById('ext-loc').innerText,
                    latency: document.getElementById('rtt-value').innerText.replace(/<[^>]*>/g, '').trim(),
                    node: '${nodeInfo.name} (${colo})'
                };
                const response = await fetch(window.location.pathname + '?act=analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userInfo)
                });

                if (!response.ok) {
                    const errText = await response.text();
                    // \u5C1D\u8BD5\u89E3\u6790 JSON \u9519\u8BEF
                    try {
                       const jsonErr = JSON.parse(errText);
                       throw new Error(jsonErr.error || errText);
                    } catch(e) {
                       throw new Error(errText || \`\u670D\u52A1\u5668\u9519\u8BEF: \${response.status}\`);
                    }
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const formattedChunk = chunk.replace(/\\n/g, '<br>');

                    if (isFirstChunk && /[\u4E00-\u9FA5]/.test(chunk)) {
                        p.classList.remove('loading');
                        p.innerHTML = formattedChunk;
                        isFirstChunk = false;
                    } else if (!isFirstChunk) {
                        p.innerHTML += formattedChunk;
                    }
                }
            } catch (error) {
                p.classList.remove('loading');
                p.innerHTML = '<span class="error">\u5206\u6790\u5931\u8D25\uFF1A' + error.message + '</span>';
            }
        }
    <\/script>
</body>
</html>
  `;
}
__name(generateHTML, "generateHTML");
var pages_default = pages;

// src/app.ts
var app = new Hono2();
app.use("/*", async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("X-XSS-Protection", "1; mode=block");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
});
app.use("/api/*", cors({
  origin: "*",
  // 保持通配符，因为是公开 API
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  maxAge: 86400,
  exposeHeaders: ["Content-Length"]
}));
app.use("/*", async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  if (duration > 1e3) {
    console.warn(`[Slow] ${c.req.method} ${c.req.path} - ${duration}ms`);
  }
});
app.route("/api", api_default);
app.route("/", pages_default);
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  return c.json({ error: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" }, 500);
});
var app_default = app;

// src/index.ts
var src_default = app_default;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-aVPeBR/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-aVPeBR/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
