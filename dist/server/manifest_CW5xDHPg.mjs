import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import 'html-escaper';
import 'clsx';
import './chunks/astro_CavJt305.mjs';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/node","routes":[{"file":"projects/cashew/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/cashew","isIndex":false,"type":"page","pattern":"^\\/projects\\/cashew\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"cashew","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/cashew.astro","pathname":"/projects/cashew","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/equilibrium/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/equilibrium","isIndex":false,"type":"page","pattern":"^\\/projects\\/equilibrium\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"equilibrium","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/equilibrium.astro","pathname":"/projects/equilibrium","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/eska/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/eska","isIndex":false,"type":"page","pattern":"^\\/projects\\/eska\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"eska","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/eska.astro","pathname":"/projects/eska","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/keroncong/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/keroncong","isIndex":false,"type":"page","pattern":"^\\/projects\\/keroncong\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"keroncong","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/keroncong.astro","pathname":"/projects/keroncong","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/pokchoy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/pokchoy","isIndex":false,"type":"page","pattern":"^\\/projects\\/pokchoy\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"pokchoy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/pokchoy.astro","pathname":"/projects/pokchoy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/stairs-of-silhouette/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects/stairs-of-silhouette","isIndex":false,"type":"page","pattern":"^\\/projects\\/stairs-of-silhouette\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}],[{"content":"stairs-of-silhouette","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/stairs-of-silhouette.astro","pathname":"/projects/stairs-of-silhouette","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/api/keystatic/[...params]","pattern":"^\\/api\\/keystatic(?:\\/(.*?))?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-api.js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/keystatic/[...params]","pattern":"^\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-astro-page.astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/workspaces/portfolio-update/src/pages/projects/cashew.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/projects/equilibrium.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/projects/eska.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/projects/keroncong.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/projects/pokchoy.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/projects/stairs-of-silhouette.astro",{"propagation":"none","containsHead":true}],["/workspaces/portfolio-update/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/@keystatic/astro/internal/keystatic-api.js":"chunks/pages/keystatic-api_DbGAdeLm.mjs","/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro":"chunks/pages/keystatic-astro-page_DSE6lrOE.mjs","/node_modules/astro/dist/assets/endpoint/node.js":"chunks/pages/node_cpvhtWqJ.mjs","\u0000@astrojs-manifest":"manifest_CW5xDHPg.mjs","/workspaces/portfolio-update/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"chunks/node_JXLd6DTi.mjs","\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-api@_@js":"chunks/keystatic-api_B858xzey.mjs","\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-astro-page@_@astro":"chunks/keystatic-astro-page_87yGn94g.mjs","\u0000@astro-page:src/pages/projects/cashew@_@astro":"chunks/cashew_J33Nq489.mjs","\u0000@astro-page:src/pages/projects/equilibrium@_@astro":"chunks/equilibrium_Bzdvq2F2.mjs","\u0000@astro-page:src/pages/projects/eska@_@astro":"chunks/eska_CRd0NXgo.mjs","\u0000@astro-page:src/pages/projects/keroncong@_@astro":"chunks/keroncong_Bc-Xad1C.mjs","\u0000@astro-page:src/pages/projects/pokchoy@_@astro":"chunks/pokchoy_CZWLqGIZ.mjs","\u0000@astro-page:src/pages/projects/stairs-of-silhouette@_@astro":"chunks/stairs-of-silhouette_CNOWnq9C.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_BPByplcO.mjs","@astrojs/react/client.js":"src/assets/client.Osr89htk.js","/astro/hoisted.js?q=0":"src/assets/hoisted.D_9Dua4q.js","/workspaces/portfolio-update/node_modules/@keystatic/astro/internal/keystatic-page.js":"src/assets/keystatic-page.oBgtWiX5.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/src/assets/equilibrium.BsbhzLbn.jpg","/src/assets/stairs-of-silhouette.DU9Viny0.jpg","/src/assets/keroncong.BnQvO8H5.jpg","/src/assets/pokchoy.DJYTZULk.jpg","/src/assets/eska.C9OuNBfV.jpg","/src/assets/cashew.BDMv1TxJ.jpg","/src/assets/index.CbJoegE-.css","/favicon.svg","/src/assets/client.Osr89htk.js","/src/assets/hoisted.D_9Dua4q.js","/src/assets/index.DjvEYLNn.js","/src/assets/keystatic-page.oBgtWiX5.js","/projects/cashew/index.html","/projects/equilibrium/index.html","/projects/eska/index.html","/projects/keroncong/index.html","/projects/pokchoy/index.html","/projects/stairs-of-silhouette/index.html","/index.html"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
