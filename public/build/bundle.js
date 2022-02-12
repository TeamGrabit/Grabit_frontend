
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.46.3 */

    const { Error: Error_1, Object: Object_1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const user = writable(null);

    function login() {
    	push('/');
    	user.set('llJTOll');
    }

    function logout() {
    	user.set(null);
    }

    const GIT_URL = 'https://github.com';

    /* src\storybook\Button.svelte generated by Svelte v3.46.3 */

    const file$m = "src\\storybook\\Button.svelte";

    function create_fragment$m(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "Button svelte-g6wdwl");
    			set_style(button, "--width", /*width*/ ctx[0] || 'fit-content');
    			set_style(button, "--height", /*height*/ ctx[1] || 'fit-content');
    			set_style(button, "--backgroundColor", /*backgroundColor*/ ctx[2] || 'white');
    			add_location(button, file$m, 7, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[3])) /*onClick*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(button, "--width", /*width*/ ctx[0] || 'fit-content');
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(button, "--height", /*height*/ ctx[1] || 'fit-content');
    			}

    			if (!current || dirty & /*backgroundColor*/ 4) {
    				set_style(button, "--backgroundColor", /*backgroundColor*/ ctx[2] || 'white');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { backgroundColor } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['width', 'height', 'backgroundColor', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(2, backgroundColor = $$props.backgroundColor);
    		if ('onClick' in $$props) $$invalidate(3, onClick = $$props.onClick);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ width, height, backgroundColor, onClick });

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(2, backgroundColor = $$props.backgroundColor);
    		if ('onClick' in $$props) $$invalidate(3, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, backgroundColor, onClick, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			width: 0,
    			height: 1,
    			backgroundColor: 2,
    			onClick: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<Button> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<Button> was created without expected prop 'height'");
    		}

    		if (/*backgroundColor*/ ctx[2] === undefined && !('backgroundColor' in props)) {
    			console.warn("<Button> was created without expected prop 'backgroundColor'");
    		}

    		if (/*onClick*/ ctx[3] === undefined && !('onClick' in props)) {
    			console.warn("<Button> was created without expected prop 'onClick'");
    		}
    	}

    	get width() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\storybook\Dropdown.svelte generated by Svelte v3.46.3 */
    const file$l = "src\\storybook\\Dropdown.svelte";

    // (24:0) {#if open}
    function create_if_block$4(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "Dropdown " + /*rightCss*/ ctx[1] + " svelte-1fha40q");
    			add_location(div, file$l, 24, 1, 482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*rightCss*/ 2 && div_class_value !== (div_class_value = "Dropdown " + /*rightCss*/ ctx[1] + " svelte-1fha40q")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(24:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	let { onClickOut } = $$props;
    	let { open } = $$props;
    	let { right } = $$props;
    	let rightCss;
    	if (right) rightCss = 'Dropdown--right';

    	function onClickOutside(e) {
    		if (open) {
    			if (!e.target.closest('.Dropdown')) {
    				if (!e.target.closest('.header__profile')) onClickOut();
    			}
    		}
    	}

    	document.addEventListener('click', onClickOutside);

    	window.onhashchange = function () {
    		onClickOut();
    	};

    	const writable_props = ['onClickOut', 'open', 'right'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClickOut' in $$props) $$invalidate(2, onClickOut = $$props.onClickOut);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('right' in $$props) $$invalidate(3, right = $$props.right);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onClickOut,
    		open,
    		right,
    		rightCss,
    		onClickOutside
    	});

    	$$self.$inject_state = $$props => {
    		if ('onClickOut' in $$props) $$invalidate(2, onClickOut = $$props.onClickOut);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('right' in $$props) $$invalidate(3, right = $$props.right);
    		if ('rightCss' in $$props) $$invalidate(1, rightCss = $$props.rightCss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, rightCss, onClickOut, right, $$scope, slots];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { onClickOut: 2, open: 0, right: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClickOut*/ ctx[2] === undefined && !('onClickOut' in props)) {
    			console.warn("<Dropdown> was created without expected prop 'onClickOut'");
    		}

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<Dropdown> was created without expected prop 'open'");
    		}

    		if (/*right*/ ctx[3] === undefined && !('right' in props)) {
    			console.warn("<Dropdown> was created without expected prop 'right'");
    		}
    	}

    	get onClickOut() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickOut(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\storybook\DropdownItem.svelte generated by Svelte v3.46.3 */

    const file$k = "src\\storybook\\DropdownItem.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "DropdownItem svelte-knsv65");
    			add_location(div, file$k, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownItem', slots, ['default']);
    	let { onClick } = $$props;
    	const writable_props = ['onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DropdownItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onClick });

    	$$self.$inject_state = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick, $$scope, slots];
    }

    class DropdownItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownItem",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClick*/ ctx[0] === undefined && !('onClick' in props)) {
    			console.warn("<DropdownItem> was created without expected prop 'onClick'");
    		}
    	}

    	get onClick() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\storybook\Inputxt.svelte generated by Svelte v3.46.3 */

    const file$j = "src\\storybook\\Inputxt.svelte";

    function create_fragment$j(ctx) {
    	let input;
    	let input_size_value;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "size", input_size_value = /*size*/ ctx[1] || 34);
    			attr_dev(input, "maxlength", /*maxlength*/ ctx[2]);
    			attr_dev(input, "placeholder", input_placeholder_value = /*placeholder*/ ctx[3] || '');
    			attr_dev(input, "class", "svelte-1u1j8pw");
    			add_location(input, file$j, 7, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*bindvalue*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 2 && input_size_value !== (input_size_value = /*size*/ ctx[1] || 34)) {
    				attr_dev(input, "size", input_size_value);
    			}

    			if (dirty & /*maxlength*/ 4) {
    				attr_dev(input, "maxlength", /*maxlength*/ ctx[2]);
    			}

    			if (dirty & /*placeholder*/ 8 && input_placeholder_value !== (input_placeholder_value = /*placeholder*/ ctx[3] || '')) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*bindvalue*/ 1 && input.value !== /*bindvalue*/ ctx[0]) {
    				set_input_value(input, /*bindvalue*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Inputxt', slots, []);
    	let { bindvalue } = $$props;
    	let { size } = $$props;
    	let { maxlength } = $$props;
    	let { placeholder } = $$props;
    	const writable_props = ['bindvalue', 'size', 'maxlength', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Inputxt> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		bindvalue = this.value;
    		$$invalidate(0, bindvalue);
    	}

    	$$self.$$set = $$props => {
    		if ('bindvalue' in $$props) $$invalidate(0, bindvalue = $$props.bindvalue);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('maxlength' in $$props) $$invalidate(2, maxlength = $$props.maxlength);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({ bindvalue, size, maxlength, placeholder });

    	$$self.$inject_state = $$props => {
    		if ('bindvalue' in $$props) $$invalidate(0, bindvalue = $$props.bindvalue);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('maxlength' in $$props) $$invalidate(2, maxlength = $$props.maxlength);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bindvalue, size, maxlength, placeholder, input_input_handler];
    }

    class Inputxt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			bindvalue: 0,
    			size: 1,
    			maxlength: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Inputxt",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bindvalue*/ ctx[0] === undefined && !('bindvalue' in props)) {
    			console.warn("<Inputxt> was created without expected prop 'bindvalue'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Inputxt> was created without expected prop 'size'");
    		}

    		if (/*maxlength*/ ctx[2] === undefined && !('maxlength' in props)) {
    			console.warn("<Inputxt> was created without expected prop 'maxlength'");
    		}

    		if (/*placeholder*/ ctx[3] === undefined && !('placeholder' in props)) {
    			console.warn("<Inputxt> was created without expected prop 'placeholder'");
    		}
    	}

    	get bindvalue() {
    		throw new Error("<Inputxt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bindvalue(value) {
    		throw new Error("<Inputxt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Inputxt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Inputxt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxlength() {
    		throw new Error("<Inputxt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxlength(value) {
    		throw new Error("<Inputxt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Inputxt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Inputxt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\storybook\SubNavigation.svelte generated by Svelte v3.46.3 */

    const file$i = "src\\storybook\\SubNavigation.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "SubNavigation svelte-1iv5uzm");
    			add_location(div, file$i, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubNavigation', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubNavigation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SubNavigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigation",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\storybook\SubNavigationItem.svelte generated by Svelte v3.46.3 */
    const file$h = "src\\storybook\\SubNavigationItem.svelte";

    // (14:1) {#if isActive}
    function create_if_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "SubNavigationItem__active svelte-1n6ta5e");
    			add_location(div, file$h, 14, 2, 314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(14:1) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isActive*/ ctx[1] && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "SubNavigationItem " + /*activeCss*/ ctx[2] + " svelte-1n6ta5e");
    			add_location(div, file$h, 12, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*isActive*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*activeCss*/ 4 && div_class_value !== (div_class_value = "SubNavigationItem " + /*activeCss*/ ctx[2] + " svelte-1n6ta5e")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubNavigationItem', slots, ['default']);
    	let { onClick } = $$props;
    	let { isActive } = $$props;
    	let activeCss;

    	afterUpdate(() => {
    		if (isActive) $$invalidate(2, activeCss = "SubNavigationItem--active"); else $$invalidate(2, activeCss = '');
    	});

    	const writable_props = ['onClick', 'isActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubNavigationItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onClick,
    		isActive,
    		afterUpdate,
    		activeCss
    	});

    	$$self.$inject_state = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    		if ('activeCss' in $$props) $$invalidate(2, activeCss = $$props.activeCss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick, isActive, activeCss, $$scope, slots];
    }

    class SubNavigationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { onClick: 0, isActive: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigationItem",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClick*/ ctx[0] === undefined && !('onClick' in props)) {
    			console.warn("<SubNavigationItem> was created without expected prop 'onClick'");
    		}

    		if (/*isActive*/ ctx[1] === undefined && !('isActive' in props)) {
    			console.warn("<SubNavigationItem> was created without expected prop 'isActive'");
    		}
    	}

    	get onClick() {
    		throw new Error("<SubNavigationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<SubNavigationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isActive() {
    		throw new Error("<SubNavigationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<SubNavigationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.46.3 */
    const file$g = "src\\components\\Header.svelte";

    // (45:2) {:else}
    function create_else_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "guest";
    			add_location(span, file$g, 45, 3, 1222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(45:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:2) {#if $user}
    function create_if_block$2(ctx) {
    	let span;
    	let img;
    	let img_src_value;
    	let t;
    	let dropdown;
    	let current;
    	let mounted;
    	let dispose;

    	dropdown = new Dropdown({
    			props: {
    				open: /*isOpenDropdown*/ ctx[1],
    				onClickOut: /*onClickOut*/ ctx[4],
    				right: true,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			img = element("img");
    			t = space();
    			create_component(dropdown.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "header__profile__img svelte-kgkk5q");
    			add_location(img, file$g, 33, 4, 897);
    			attr_dev(span, "class", "header__profile svelte-kgkk5q");
    			add_location(span, file$g, 32, 3, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, img);
    			append_dev(span, t);
    			mount_component(dropdown, span, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickProfile*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const dropdown_changes = {};
    			if (dirty & /*isOpenDropdown*/ 2) dropdown_changes.open = /*isOpenDropdown*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(dropdown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(32:2) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (41:5) <DropdownItem onClick=''>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("내정보");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(41:5) <DropdownItem onClick=''>",
    		ctx
    	});

    	return block;
    }

    // (42:5) <DropdownItem onClick={logout}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("로그아웃");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(42:5) <DropdownItem onClick={logout}>",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Dropdown open={isOpenDropdown} {onClickOut} right>
    function create_default_slot$6(ctx) {
    	let dropdownitem0;
    	let t;
    	let dropdownitem1;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				onClick: "",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				onClick: logout,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem0.$$.fragment);
    			t = space();
    			create_component(dropdownitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(40:4) <Dropdown open={isOpenDropdown} {onClickOut} right>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = `${name}`;
    			t2 = space();
    			if_block.c();
    			attr_dev(img, "class", "header__logo__img svelte-kgkk5q");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$g, 26, 3, 703);
    			attr_dev(div0, "class", "header__title svelte-kgkk5q");
    			add_location(div0, file$g, 27, 3, 781);
    			attr_dev(div1, "class", "header__logo svelte-kgkk5q");
    			add_location(div1, file$g, 25, 2, 645);
    			attr_dev(div2, "class", "header__container svelte-kgkk5q");
    			add_location(div2, file$g, 24, 1, 610);
    			attr_dev(div3, "class", "header svelte-kgkk5q");
    			add_location(div3, file$g, 23, 0, 587);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div2, t2);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const name = "Grabit";

    function instance$g($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let src = '';
    	let isOpenDropdown = false;

    	const unsubscribe = user.subscribe(value => {
    		$$invalidate(0, src = `${GIT_URL}/${value}.png`);
    	});

    	const onClickProfile = () => {
    		$$invalidate(1, isOpenDropdown = !isOpenDropdown);
    	};

    	const onClickOut = () => {
    		$$invalidate(1, isOpenDropdown = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		push('/');
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		link,
    		push,
    		user,
    		logout,
    		GIT_URL,
    		Dropdown,
    		DropdownItem,
    		name,
    		src,
    		isOpenDropdown,
    		unsubscribe,
    		onClickProfile,
    		onClickOut,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('isOpenDropdown' in $$props) $$invalidate(1, isOpenDropdown = $$props.isOpenDropdown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, isOpenDropdown, $user, onClickProfile, onClickOut, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.46.3 */

    const file$f = "src\\components\\Footer.svelte";

    function create_fragment$f(ctx) {
    	let div8;
    	let div7;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div6;
    	let div2;
    	let t4;
    	let div3;
    	let t6;
    	let div4;
    	let t8;
    	let div5;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "ⓒ Grabit Project";
    			t2 = space();
    			div6 = element("div");
    			div2 = element("div");
    			div2.textContent = "사이트소개";
    			t4 = space();
    			div3 = element("div");
    			div3.textContent = "이용약관";
    			t6 = space();
    			div4 = element("div");
    			div4.textContent = "개인정보처리방침";
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "고객센터";
    			attr_dev(img, "class", "logo_img svelte-aio8gc");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$f, 6, 3, 106);
    			attr_dev(div0, "class", "footer_title svelte-aio8gc");
    			add_location(div0, file$f, 7, 3, 175);
    			attr_dev(div1, "class", "footer_logo svelte-aio8gc");
    			add_location(div1, file$f, 5, 2, 76);
    			attr_dev(div2, "class", "menu_text svelte-aio8gc");
    			add_location(div2, file$f, 10, 3, 267);
    			attr_dev(div3, "class", "menu_text svelte-aio8gc");
    			add_location(div3, file$f, 11, 3, 306);
    			attr_dev(div4, "class", "menu_text svelte-aio8gc");
    			add_location(div4, file$f, 12, 3, 344);
    			attr_dev(div5, "class", "menu_text svelte-aio8gc");
    			add_location(div5, file$f, 13, 3, 386);
    			attr_dev(div6, "class", "footer_menu svelte-aio8gc");
    			add_location(div6, file$f, 9, 2, 237);
    			attr_dev(div7, "class", "footer_inner svelte-aio8gc");
    			add_location(div7, file$f, 4, 1, 46);
    			attr_dev(div8, "class", "footer svelte-aio8gc");
    			add_location(div8, file$f, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div7, t2);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div6, t4);
    			append_dev(div6, div3);
    			append_dev(div6, t6);
    			append_dev(div6, div4);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\Container.svelte generated by Svelte v3.46.3 */

    const file$e = "src\\components\\Container.svelte";

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "container svelte-1nwvob2");
    			add_location(div0, file$e, 5, 1, 59);
    			attr_dev(div1, "class", "container_outside svelte-1nwvob2");
    			add_location(div1, file$e, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const tabIndex = writable(0);

    function changeTab(index) {
    	tabIndex.set(index);
    }

    const index = {
    	HOME: 0,
    	MYCHALLENGE: 1,
    	OTHERS: 2,
    };

    /* src\components\GlobalNavigationBar.svelte generated by Svelte v3.46.3 */
    const file$d = "src\\components\\GlobalNavigationBar.svelte";

    function create_fragment$d(ctx) {
    	let div4;
    	let div1;
    	let t0;
    	let div0;
    	let div1_class_value;
    	let t1;
    	let div3;
    	let t2;
    	let div2;
    	let div3_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			t0 = text("My Challenges\r\n\t\t");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			t2 = text("View Other Challenges\r\n\t\t");
    			div2 = element("div");
    			attr_dev(div0, "class", "bar svelte-1tym3n4");
    			add_location(div0, file$d, 22, 2, 522);
    			attr_dev(div1, "class", div1_class_value = "gnb_menu " + /*classNames*/ ctx[0][0] + " svelte-1tym3n4");
    			add_location(div1, file$d, 20, 1, 442);
    			attr_dev(div2, "class", "bar svelte-1tym3n4");
    			add_location(div2, file$d, 26, 2, 620);
    			attr_dev(div3, "class", div3_class_value = "gnb_menu " + /*classNames*/ ctx[0][1] + " svelte-1tym3n4");
    			add_location(div3, file$d, 24, 1, 553);
    			attr_dev(div4, "class", "gnb svelte-1tym3n4");
    			add_location(div4, file$d, 19, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*onClickMy*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classNames*/ 1 && div1_class_value !== (div1_class_value = "gnb_menu " + /*classNames*/ ctx[0][0] + " svelte-1tym3n4")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*classNames*/ 1 && div3_class_value !== (div3_class_value = "gnb_menu " + /*classNames*/ ctx[0][1] + " svelte-1tym3n4")) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $tabIndex;
    	validate_store(tabIndex, 'tabIndex');
    	component_subscribe($$self, tabIndex, $$value => $$invalidate(2, $tabIndex = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GlobalNavigationBar', slots, []);
    	let classNames = ['', ''];

    	function onClickMy() {
    		push('/mychallenge');
    	}

    	beforeUpdate(() => {
    		$$invalidate(0, classNames = ['', '']);
    		if ($tabIndex !== 0) $$invalidate(0, classNames[$tabIndex - 1] = 'active', classNames);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GlobalNavigationBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		push,
    		beforeUpdate,
    		afterUpdate,
    		tabIndex,
    		changeTab,
    		index,
    		classNames,
    		onClickMy,
    		$tabIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('classNames' in $$props) $$invalidate(0, classNames = $$props.classNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classNames, onClickMy];
    }

    class GlobalNavigationBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GlobalNavigationBar",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\Profile.svelte generated by Svelte v3.46.3 */
    const file$c = "src\\components\\Profile.svelte";

    function create_fragment$c(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*$user*/ ctx[0]);
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "Edit profile";
    			attr_dev(div0, "class", "profile_img svelte-1ihagqt");
    			add_location(div0, file$c, 5, 1, 90);
    			attr_dev(div1, "class", "profile_id svelte-1ihagqt");
    			add_location(div1, file$c, 6, 1, 120);
    			attr_dev(div2, "class", "edit_btn svelte-1ihagqt");
    			add_location(div2, file$c, 7, 1, 160);
    			attr_dev(div3, "class", "profile svelte-1ihagqt");
    			add_location(div3, file$c, 4, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$user*/ 1) set_data_dev(t1, /*$user*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ user, $user });
    	return [$user];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\Grass.svelte generated by Svelte v3.46.3 */

    const file$b = "src\\components\\Grass.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:2) {:else}
    function create_else_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*commit_count*/ ctx[4] < 9) return create_if_block_1$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if isBig}
    function create_if_block$1(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*commit_count*/ ctx[4] * /*color_level*/ ctx[3] / /*group_num*/ ctx[2]) + " svelte-2jzcz");
    			add_location(div, file$b, 11, 3, 244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grass_list, group_num*/ 5 && div_class_value !== (div_class_value = "grass grass_" + Math.ceil(/*commit_count*/ ctx[4] * /*color_level*/ ctx[3] / /*group_num*/ ctx[2]) + " svelte-2jzcz")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:2) {#if isBig}",
    		ctx
    	});

    	return block;
    }

    // (17:3) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "grass grass_4 svelte-2jzcz");
    			add_location(div, file$b, 18, 4, 506);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(17:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:3) {#if commit_count < 9}
    function create_if_block_1$1(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*commit_count*/ ctx[4] / 2) + " svelte-2jzcz");
    			add_location(div, file$b, 15, 4, 389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grass_list*/ 1 && div_class_value !== (div_class_value = "grass grass_" + Math.ceil(/*commit_count*/ ctx[4] / 2) + " svelte-2jzcz")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(15:3) {#if commit_count < 9}",
    		ctx
    	});

    	return block;
    }

    // (9:1) {#each grass_list as commit_count}
    function create_each_block$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isBig*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(9:1) {#each grass_list as commit_count}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let div_class_value;
    	let each_value = /*grass_list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "box " + (/*isBig*/ ctx[1] ? "big_box" : "grass_box") + " svelte-2jzcz");
    			add_location(div, file$b, 7, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Math, grass_list, color_level, group_num, isBig*/ 15) {
    				each_value = /*grass_list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isBig*/ 2 && div_class_value !== (div_class_value = "box " + (/*isBig*/ ctx[1] ? "big_box" : "grass_box") + " svelte-2jzcz")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grass', slots, []);
    	let { grass_list } = $$props;
    	let { isBig } = $$props;
    	let { group_num } = $$props;
    	let color_level = 4;
    	const writable_props = ['grass_list', 'isBig', 'group_num'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grass> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('grass_list' in $$props) $$invalidate(0, grass_list = $$props.grass_list);
    		if ('isBig' in $$props) $$invalidate(1, isBig = $$props.isBig);
    		if ('group_num' in $$props) $$invalidate(2, group_num = $$props.group_num);
    	};

    	$$self.$capture_state = () => ({
    		grass_list,
    		isBig,
    		group_num,
    		color_level
    	});

    	$$self.$inject_state = $$props => {
    		if ('grass_list' in $$props) $$invalidate(0, grass_list = $$props.grass_list);
    		if ('isBig' in $$props) $$invalidate(1, isBig = $$props.isBig);
    		if ('group_num' in $$props) $$invalidate(2, group_num = $$props.group_num);
    		if ('color_level' in $$props) $$invalidate(3, color_level = $$props.color_level);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [grass_list, isBig, group_num, color_level];
    }

    class Grass extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { grass_list: 0, isBig: 1, group_num: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grass",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*grass_list*/ ctx[0] === undefined && !('grass_list' in props)) {
    			console.warn("<Grass> was created without expected prop 'grass_list'");
    		}

    		if (/*isBig*/ ctx[1] === undefined && !('isBig' in props)) {
    			console.warn("<Grass> was created without expected prop 'isBig'");
    		}

    		if (/*group_num*/ ctx[2] === undefined && !('group_num' in props)) {
    			console.warn("<Grass> was created without expected prop 'group_num'");
    		}
    	}

    	get grass_list() {
    		throw new Error("<Grass>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grass_list(value) {
    		throw new Error("<Grass>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBig() {
    		throw new Error("<Grass>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBig(value) {
    		throw new Error("<Grass>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group_num() {
    		throw new Error("<Grass>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group_num(value) {
    		throw new Error("<Grass>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.46.3 */
    const file$a = "src\\pages\\Home.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (41:4) {#each challenge_list as c}
    function create_each_block$5(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*c*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*c*/ ctx[4].intro + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*c*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", "box_title svelte-1kl15dm");
    			add_location(div0, file$a, 42, 6, 1143);
    			attr_dev(div1, "class", "box_intro svelte-1kl15dm");
    			add_location(div1, file$a, 43, 6, 1233);
    			attr_dev(div2, "class", "challenge_box svelte-1kl15dm");
    			add_location(div2, file$a, 41, 5, 1108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(41:4) {#each challenge_list as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div6;
    	let profile;
    	let t1;
    	let div5;
    	let div2;
    	let div0;
    	let t3;
    	let div1;
    	let t4;
    	let div4;
    	let div3;
    	let t6;
    	let grass;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	profile = new Profile({ $$inline: true });
    	let each_value = /*challenge_list*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	grass = new Grass({
    			props: { grass_list: /*grass_list*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			create_component(profile.$$.fragment);
    			t1 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "즐겨찾는 챌린지";
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div3.textContent = "나의 잔디";
    			t6 = space();
    			create_component(grass.$$.fragment);
    			attr_dev(div0, "class", "content_title svelte-1kl15dm");
    			add_location(div0, file$a, 38, 3, 995);
    			attr_dev(div1, "class", "box_container svelte-1kl15dm");
    			add_location(div1, file$a, 39, 3, 1041);
    			attr_dev(div2, "class", "pinned");
    			add_location(div2, file$a, 37, 2, 970);
    			attr_dev(div3, "class", "content_title svelte-1kl15dm");
    			add_location(div3, file$a, 49, 3, 1346);
    			attr_dev(div4, "class", "grass");
    			add_location(div4, file$a, 48, 2, 1322);
    			attr_dev(div5, "class", "content svelte-1kl15dm");
    			add_location(div5, file$a, 36, 1, 945);
    			attr_dev(div6, "class", "overview svelte-1kl15dm");
    			add_location(div6, file$a, 34, 0, 906);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(profile, div6, null);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div4, t6);
    			mount_component(grass, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*challenge_list, push*/ 2) {
    				each_value = /*challenge_list*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const grass_changes = {};
    			if (dirty & /*grass_list*/ 1) grass_changes.grass_list = /*grass_list*/ ctx[0];
    			grass.$set(grass_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			transition_in(grass.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(grass.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);
    			destroy_component(profile);
    			destroy_each(each_blocks, detaching);
    			destroy_component(grass);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);

    	let challenge_list = [
    		{
    			num: 1,
    			name: "CS 1일 1커밋 방",
    			intro: "하루에 한 번씩 커밋하기!"
    		},
    		{
    			num: 2,
    			name: "My Private Challenge",
    			intro: "이 챌린지는 내가 관리하는 챌린지다!!"
    		},
    		{
    			num: 3,
    			name: "No.3",
    			intro: "누가 넘바 쓰리래, 나 넘바 투야!"
    		}
    	];

    	let grass_list = new Array(365);

    	for (let i = 0; i < 365; i += 1) {
    		grass_list[i] = i % 2;
    	}

    	// TODO: 유저별로 home을 만들지 자기 home만 보이게 할 것인지 회의 필요
    	beforeUpdate(() => {
    		if (!$user) {
    			push('/login');
    		}
    	});

    	onMount(() => {
    		changeTab(0);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = c => {
    		push(`/challenge/${c.num}`);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		push,
    		onMount,
    		beforeUpdate,
    		GlobalNavigationBar,
    		Profile,
    		Grass,
    		user,
    		changeTab,
    		challenge_list,
    		grass_list,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('challenge_list' in $$props) $$invalidate(1, challenge_list = $$props.challenge_list);
    		if ('grass_list' in $$props) $$invalidate(0, grass_list = $$props.grass_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [grass_list, challenge_list, click_handler];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\pages\Login.svelte generated by Svelte v3.46.3 */
    const file$9 = "src\\pages\\Login.svelte";

    // (12:1) <Button    width='15rem'    height='2.5rem'    backgroundColor='var(--main-white-color)'    {onClick}   >
    function create_default_slot$5(ctx) {
    	let span1;
    	let img;
    	let img_src_value;
    	let t0;
    	let span0;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			img = element("img");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "깃허브 로그인";
    			attr_dev(img, "class", "Login__icon svelte-f1jb8c");
    			if (!src_url_equal(img.src, img_src_value = "images/github.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "gitIcon");
    			add_location(img, file$9, 18, 3, 379);
    			add_location(span0, file$9, 19, 3, 449);
    			attr_dev(span1, "class", "Login__slot svelte-f1jb8c");
    			add_location(span1, file$9, 17, 2, 348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, img);
    			append_dev(span1, t0);
    			append_dev(span1, span0);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(12:1) <Button    width='15rem'    height='2.5rem'    backgroundColor='var(--main-white-color)'    {onClick}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				width: "15rem",
    				height: "2.5rem",
    				backgroundColor: "var(--main-white-color)",
    				onClick: /*onClick*/ ctx[0],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			create_component(button.$$.fragment);
    			attr_dev(img, "class", "Login__logo svelte-f1jb8c");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$9, 10, 1, 169);
    			attr_dev(div, "class", "Login svelte-f1jb8c");
    			add_location(div, file$9, 9, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);

    	function onClick() {
    		login();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ login, Button, onClick });
    	return [onClick];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Setting.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file$8 = "src\\pages\\Setting.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (18:3) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>
    function create_default_slot_1$2(ctx) {
    	let t_value = /*item*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(18:3) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#each tabItem as item, index}
    function create_each_block$4(ctx) {
    	let subnavitem;
    	let current;

    	function func() {
    		return /*func*/ ctx[3](/*index*/ ctx[7]);
    	}

    	subnavitem = new SubNavigationItem({
    			props: {
    				onClick: func,
    				isActive: /*activeItem*/ ctx[0] === /*index*/ ctx[7],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(subnavitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(subnavitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const subnavitem_changes = {};
    			if (dirty & /*activeItem*/ 1) subnavitem_changes.isActive = /*activeItem*/ ctx[0] === /*index*/ ctx[7];

    			if (dirty & /*$$scope*/ 256) {
    				subnavitem_changes.$$scope = { dirty, ctx };
    			}

    			subnavitem.$set(subnavitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(subnavitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(subnavitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(subnavitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(17:2) {#each tabItem as item, index}",
    		ctx
    	});

    	return block;
    }

    // (16:1) <SubNav>
    function create_default_slot$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*tabItem*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*onClickItem, activeItem, tabItem*/ 7) {
    				each_value = /*tabItem*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(16:1) <SubNav>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let subnav;
    	let t;
    	let current;

    	subnav = new SubNavigation({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(subnav.$$.fragment);
    			t = text("\r\n\tSetting page");
    			attr_dev(div, "class", "Setting");
    			add_location(div, file$8, 14, 0, 281);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(subnav, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const subnav_changes = {};

    			if (dirty & /*$$scope, activeItem*/ 257) {
    				subnav_changes.$$scope = { dirty, ctx };
    			}

    			subnav.$set(subnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(subnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(subnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(subnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Setting', slots, []);
    	const tabItem = ['설정', '참여 승인'];
    	let activeItem = -1;

    	function onClickItem(i) {
    		$$invalidate(0, activeItem = i);
    		console.log(activeItem);
    	}

    	function setActive(i) {
    		if (i === activeItem) return true;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Setting> was created with unknown prop '${key}'`);
    	});

    	const func = index => onClickItem(index);

    	$$self.$capture_state = () => ({
    		SubNav: SubNavigation,
    		SubNavItem: SubNavigationItem,
    		tabItem,
    		activeItem,
    		onClickItem,
    		setActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, tabItem, onClickItem, func];
    }

    class Setting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Setting",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\CommitRequest.svelte generated by Svelte v3.46.3 */
    const file$7 = "src\\components\\CommitRequest.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (17:6) <Button         width='5rem'         height='2rem'         backgroundColor='#B8FFC8'        >
    function create_default_slot_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "승인";
    			attr_dev(div, "class", "btn_txt svelte-1bh6s3u");
    			add_location(div, file$7, 21, 7, 592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(17:6) <Button         width='5rem'         height='2rem'         backgroundColor='#B8FFC8'        >",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Button         width='5rem'         height='2rem'         backgroundColor='#FFB8B4'        >
    function create_default_slot$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "반려";
    			attr_dev(div, "class", "btn_txt svelte-1bh6s3u");
    			add_location(div, file$7, 29, 7, 810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(25:6) <Button         width='5rem'         height='2rem'         backgroundColor='#FFB8B4'        >",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each req_list as req}
    function create_each_block$3(ctx) {
    	let div5;
    	let div0;
    	let t0_value = /*req*/ ctx[2].desc + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*req*/ ctx[2].requester + "";
    	let t2;
    	let t3;
    	let div4;
    	let div2;
    	let t4_value = /*req*/ ctx[2].approve.length + "";
    	let t4;
    	let t5_value = " / " + "";
    	let t5;
    	let t6_value = /*group*/ ctx[0].length - 1 + "";
    	let t6;
    	let t7;
    	let div3;
    	let button0;
    	let t8;
    	let span;
    	let t9;
    	let button1;
    	let t10;
    	let current;

    	button0 = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#B8FFC8",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#FFB8B4",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div4 = element("div");
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			create_component(button0.$$.fragment);
    			t8 = space();
    			span = element("span");
    			t9 = space();
    			create_component(button1.$$.fragment);
    			t10 = space();
    			attr_dev(div0, "class", "req_box_desc svelte-1bh6s3u");
    			add_location(div0, file$7, 11, 4, 261);
    			attr_dev(div1, "class", "req_box_requester svelte-1bh6s3u");
    			add_location(div1, file$7, 12, 4, 309);
    			attr_dev(div2, "class", "approver svelte-1bh6s3u");
    			add_location(div2, file$7, 14, 5, 399);
    			set_style(span, "display", "inline-block");
    			set_style(span, "width", "0.05rem");
    			add_location(span, file$7, 23, 6, 646);
    			add_location(div3, file$7, 15, 5, 477);
    			attr_dev(div4, "class", "req_box_btn svelte-1bh6s3u");
    			add_location(div4, file$7, 13, 4, 367);
    			attr_dev(div5, "class", "req_box svelte-1bh6s3u");
    			add_location(div5, file$7, 10, 3, 234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div1, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, t4);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(button0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, span);
    			append_dev(div3, t9);
    			mount_component(button1, div3, null);
    			append_dev(div5, t10);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*req_list*/ 2) && t0_value !== (t0_value = /*req*/ ctx[2].desc + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*req_list*/ 2) && t2_value !== (t2_value = /*req*/ ctx[2].requester + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*req_list*/ 2) && t4_value !== (t4_value = /*req*/ ctx[2].approve.length + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*group*/ 1) && t6_value !== (t6_value = /*group*/ ctx[0].length - 1 + "")) set_data_dev(t6, t6_value);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(10:2) {#each req_list as req}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*req_list*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "현재 올라온 요청";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "title svelte-1bh6s3u");
    			add_location(p, file$7, 7, 1, 142);
    			attr_dev(div0, "class", "admit_req_box svelte-1bh6s3u");
    			add_location(div0, file$7, 8, 1, 175);
    			attr_dev(div1, "class", "admit_req svelte-1bh6s3u");
    			add_location(div1, file$7, 6, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*group, req_list*/ 3) {
    				each_value = /*req_list*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommitRequest', slots, []);
    	let { group } = $$props;
    	let { req_list } = $$props;
    	const writable_props = ['group', 'req_list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CommitRequest> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('req_list' in $$props) $$invalidate(1, req_list = $$props.req_list);
    	};

    	$$self.$capture_state = () => ({ Button, group, req_list });

    	$$self.$inject_state = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('req_list' in $$props) $$invalidate(1, req_list = $$props.req_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [group, req_list];
    }

    class CommitRequest extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { group: 0, req_list: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommitRequest",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*group*/ ctx[0] === undefined && !('group' in props)) {
    			console.warn("<CommitRequest> was created without expected prop 'group'");
    		}

    		if (/*req_list*/ ctx[1] === undefined && !('req_list' in props)) {
    			console.warn("<CommitRequest> was created without expected prop 'req_list'");
    		}
    	}

    	get group() {
    		throw new Error("<CommitRequest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<CommitRequest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get req_list() {
    		throw new Error("<CommitRequest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set req_list(value) {
    		throw new Error("<CommitRequest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\ChallengeDetail.svelte generated by Svelte v3.46.3 */
    const file$6 = "src\\pages\\ChallengeDetail.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (42:3) {#each group as member}
    function create_each_block$2(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*member*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t3;
    	let grass;
    	let t4;
    	let current;

    	grass = new Grass({
    			props: { grass_list: /*grass_list*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "의 잔디";
    			t3 = space();
    			create_component(grass.$$.fragment);
    			t4 = space();
    			set_style(p0, "font-weight", "bold");
    			add_location(p0, file$6, 44, 6, 1456);
    			add_location(p1, file$6, 45, 6, 1506);
    			attr_dev(div0, "class", "grass_title svelte-18za3pg");
    			add_location(div0, file$6, 43, 5, 1423);
    			attr_dev(div1, "class", "personal_grass svelte-18za3pg");
    			add_location(div1, file$6, 42, 4, 1388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div1, t3);
    			mount_component(grass, div1, null);
    			append_dev(div1, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grass_changes = {};
    			if (dirty & /*grass_list*/ 1) grass_changes.grass_list = /*grass_list*/ ctx[0];
    			grass.$set(grass_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grass.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grass.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(grass);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(42:3) {#each group as member}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div6;
    	let div3;
    	let p;
    	let t5;
    	let grass;
    	let t6;
    	let div5;
    	let div4;
    	let t7;
    	let commitrequest;
    	let current;

    	grass = new Grass({
    			props: {
    				isBig: true,
    				grass_list: /*grass_team*/ ctx[1],
    				group_num: /*group*/ ctx[3].length
    			},
    			$$inline: true
    		});

    	let each_value = /*group*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	commitrequest = new CommitRequest({
    			props: {
    				group: /*group*/ ctx[3],
    				req_list: /*req_list*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*challenge*/ ctx[2].name}`;
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = `${/*challenge*/ ctx[2].intro}`;
    			t3 = space();
    			div6 = element("div");
    			div3 = element("div");
    			p = element("p");
    			p.textContent = "Team의 잔디";
    			t5 = space();
    			create_component(grass.$$.fragment);
    			t6 = space();
    			div5 = element("div");
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			create_component(commitrequest.$$.fragment);
    			attr_dev(div0, "class", "upper_title svelte-18za3pg");
    			add_location(div0, file$6, 25, 1, 946);
    			attr_dev(div1, "class", "upper_description svelte-18za3pg");
    			add_location(div1, file$6, 26, 1, 996);
    			attr_dev(div2, "class", "upper svelte-18za3pg");
    			add_location(div2, file$6, 24, 0, 924);
    			attr_dev(p, "class", "grass_title svelte-18za3pg");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "font-size", "1.1rem");
    			add_location(p, file$6, 30, 2, 1112);
    			attr_dev(div3, "class", "team_grass svelte-18za3pg");
    			add_location(div3, file$6, 29, 1, 1084);
    			attr_dev(div4, "class", "personal svelte-18za3pg");
    			add_location(div4, file$6, 40, 2, 1332);
    			attr_dev(div5, "class", "personal_admit svelte-18za3pg");
    			add_location(div5, file$6, 39, 1, 1300);
    			attr_dev(div6, "class", "content svelte-18za3pg");
    			add_location(div6, file$6, 28, 0, 1060);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div3);
    			append_dev(div3, p);
    			append_dev(div3, t5);
    			mount_component(grass, div3, null);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div5, t7);
    			mount_component(commitrequest, div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const grass_changes = {};
    			if (dirty & /*grass_team*/ 2) grass_changes.grass_list = /*grass_team*/ ctx[1];
    			grass.$set(grass_changes);

    			if (dirty & /*grass_list, group*/ 9) {
    				each_value = /*group*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grass.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(commitrequest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grass.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(commitrequest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div6);
    			destroy_component(grass);
    			destroy_each(each_blocks, detaching);
    			destroy_component(commitrequest);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChallengeDetail', slots, []);

    	let challenge = {
    		num: 1,
    		name: "CS 1일 1커밋 방",
    		intro: "하루에 한 번씩 커밋하기!"
    	};

    	let group = ["user", "grabit123", "||JTO||", "guest"];
    	let grass_list = new Array(365);
    	let grass_team = new Array(365);

    	for (let i = 0; i < 365; i += 1) {
    		grass_list[i] = i % 9;
    		grass_team[i] = i % 5;
    	}

    	let req_list = [
    		{
    			num: 1,
    			requester: "user",
    			desc: "feat: challengeDetail",
    			approve: ["grabit_123", "||JTO||"]
    		},
    		{
    			num: 2,
    			requester: "grabit_123",
    			desc: "fix: 버그 픽스",
    			approve: []
    		},
    		{
    			num: 3,
    			requester: "||JTO||",
    			desc: "feat: commit approve request",
    			approve: ["grabit_123"]
    		},
    		{
    			num: 4,
    			requester: "||JTO||",
    			desc: "feat: commit approve request",
    			approve: ["grabit_123"]
    		},
    		{
    			num: 5,
    			requester: "||JTO||",
    			desc: "feat: commit approve request",
    			approve: ["grabit_123"]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChallengeDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Grass,
    		CommitRequest,
    		challenge,
    		group,
    		grass_list,
    		grass_team,
    		req_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('challenge' in $$props) $$invalidate(2, challenge = $$props.challenge);
    		if ('group' in $$props) $$invalidate(3, group = $$props.group);
    		if ('grass_list' in $$props) $$invalidate(0, grass_list = $$props.grass_list);
    		if ('grass_team' in $$props) $$invalidate(1, grass_team = $$props.grass_team);
    		if ('req_list' in $$props) $$invalidate(4, req_list = $$props.req_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [grass_list, grass_team, challenge, group, req_list];
    }

    class ChallengeDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChallengeDetail",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\CreateChallenge.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\pages\\CreateChallenge.svelte";

    // (61:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='var(--main-green-color)'      onClick={save}     >
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Create";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$5, 66, 4, 1834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(61:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='var(--main-green-color)'      onClick={save}     >",
    		ctx
    	});

    	return block;
    }

    // (70:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='#E3E3E3'      onClick={cancel}     >
    function create_default_slot$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cancel";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$5, 75, 4, 2003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(70:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='#E3E3E3'      onClick={cancel}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div15;
    	let div14;
    	let div0;
    	let t2;
    	let hr0;
    	let t3;
    	let div3;
    	let div1;
    	let t4;
    	let span;
    	let t6;
    	let inputxt0;
    	let updating_bindvalue;
    	let t7;
    	let div2;
    	let t9;
    	let inputxt1;
    	let updating_bindvalue_1;
    	let t10;
    	let hr1;
    	let t11;
    	let div12;
    	let div7;
    	let input0;
    	let t12;
    	let img0;
    	let img0_src_value;
    	let t13;
    	let div6;
    	let div4;
    	let t15;
    	let div5;
    	let t17;
    	let div11;
    	let input1;
    	let t18;
    	let img1;
    	let img1_src_value;
    	let t19;
    	let div10;
    	let div8;
    	let t21;
    	let div9;
    	let t23;
    	let hr2;
    	let t24;
    	let div13;
    	let button0;
    	let t25;
    	let button1;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });

    	function inputxt0_bindvalue_binding(value) {
    		/*inputxt0_bindvalue_binding*/ ctx[4](value);
    	}

    	let inputxt0_props = { maxlength: "20", size: "20" };

    	if (/*challengename*/ ctx[0] !== void 0) {
    		inputxt0_props.bindvalue = /*challengename*/ ctx[0];
    	}

    	inputxt0 = new Inputxt({ props: inputxt0_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputxt0, 'bindvalue', inputxt0_bindvalue_binding));

    	function inputxt1_bindvalue_binding(value) {
    		/*inputxt1_bindvalue_binding*/ ctx[5](value);
    	}

    	let inputxt1_props = { size: "80" };

    	if (/*description*/ ctx[1] !== void 0) {
    		inputxt1_props.bindvalue = /*description*/ ctx[1];
    	}

    	inputxt1 = new Inputxt({ props: inputxt1_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputxt1, 'bindvalue', inputxt1_bindvalue_binding));

    	button0 = new Button({
    			props: {
    				width: "7rem",
    				height: "2.5rem",
    				backgroundColor: "var(--main-green-color)",
    				onClick: /*save*/ ctx[2],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "7rem",
    				height: "2.5rem",
    				backgroundColor: "#E3E3E3",
    				onClick: /*cancel*/ ctx[3],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div0 = element("div");
    			div0.textContent = "Create New Challenge";
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t4 = text("Challenge name\r\n\t\t\t\t");
    			span = element("span");
    			span.textContent = "*";
    			t6 = space();
    			create_component(inputxt0.$$.fragment);
    			t7 = space();
    			div2 = element("div");
    			div2.textContent = "Description";
    			t9 = space();
    			create_component(inputxt1.$$.fragment);
    			t10 = space();
    			hr1 = element("hr");
    			t11 = space();
    			div12 = element("div");
    			div7 = element("div");
    			input0 = element("input");
    			t12 = space();
    			img0 = element("img");
    			t13 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Public";
    			t15 = space();
    			div5 = element("div");
    			div5.textContent = "Anyone on the internet can see this Challenge!";
    			t17 = space();
    			div11 = element("div");
    			input1 = element("input");
    			t18 = space();
    			img1 = element("img");
    			t19 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div8.textContent = "Private";
    			t21 = space();
    			div9 = element("div");
    			div9.textContent = "You choose who can see and join to this Challenge!";
    			t23 = space();
    			hr2 = element("hr");
    			t24 = space();
    			div13 = element("div");
    			create_component(button0.$$.fragment);
    			t25 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div0, "class", "title svelte-1lsqura");
    			add_location(div0, file$5, 26, 2, 600);
    			attr_dev(hr0, "align", "left");
    			attr_dev(hr0, "class", "hr svelte-1lsqura");
    			add_location(hr0, file$5, 27, 2, 647);
    			set_style(span, "color", "red");
    			add_location(span, file$5, 30, 4, 741);
    			attr_dev(div1, "class", "text svelte-1lsqura");
    			add_location(div1, file$5, 29, 3, 705);
    			attr_dev(div2, "class", "text svelte-1lsqura");
    			add_location(div2, file$5, 34, 3, 862);
    			attr_dev(div3, "class", "sub_content svelte-1lsqura");
    			add_location(div3, file$5, 28, 2, 677);
    			attr_dev(hr1, "align", "left");
    			attr_dev(hr1, "class", "hr svelte-1lsqura");
    			add_location(hr1, file$5, 38, 2, 963);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "secure");
    			input0.checked = "check";
    			add_location(input0, file$5, 41, 4, 1046);
    			attr_dev(img0, "class", "image svelte-1lsqura");
    			if (!src_url_equal(img0.src, img0_src_value = "images/public.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "public_img");
    			add_location(img0, file$5, 42, 4, 1101);
    			attr_dev(div4, "class", "small_text svelte-1lsqura");
    			add_location(div4, file$5, 44, 5, 1181);
    			attr_dev(div5, "class", "explain_text svelte-1lsqura");
    			add_location(div5, file$5, 45, 5, 1222);
    			add_location(div6, file$5, 43, 4, 1169);
    			attr_dev(div7, "class", "contain svelte-1lsqura");
    			add_location(div7, file$5, 40, 3, 1021);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "secure");
    			attr_dev(input1, "align", "middle");
    			add_location(input1, file$5, 50, 4, 1353);
    			attr_dev(img1, "class", "image svelte-1lsqura");
    			if (!src_url_equal(img1.src, img1_src_value = "images/private.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "private_img");
    			add_location(img1, file$5, 51, 4, 1408);
    			attr_dev(div8, "class", "small_text svelte-1lsqura");
    			add_location(div8, file$5, 53, 5, 1490);
    			attr_dev(div9, "class", "explain_text svelte-1lsqura");
    			add_location(div9, file$5, 54, 5, 1532);
    			add_location(div10, file$5, 52, 4, 1478);
    			attr_dev(div11, "class", "contain svelte-1lsqura");
    			add_location(div11, file$5, 49, 3, 1328);
    			attr_dev(div12, "class", "sub_content svelte-1lsqura");
    			add_location(div12, file$5, 39, 2, 993);
    			attr_dev(hr2, "align", "left");
    			attr_dev(hr2, "class", "hr svelte-1lsqura");
    			add_location(hr2, file$5, 58, 2, 1649);
    			attr_dev(div13, "class", "sub_content svelte-1lsqura");
    			add_location(div13, file$5, 59, 2, 1679);
    			attr_dev(div14, "class", "content svelte-1lsqura");
    			add_location(div14, file$5, 25, 1, 575);
    			attr_dev(div15, "class", "page svelte-1lsqura");
    			add_location(div15, file$5, 24, 0, 554);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div14);
    			append_dev(div14, div0);
    			append_dev(div14, t2);
    			append_dev(div14, hr0);
    			append_dev(div14, t3);
    			append_dev(div14, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div3, t6);
    			mount_component(inputxt0, div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div3, t9);
    			mount_component(inputxt1, div3, null);
    			append_dev(div14, t10);
    			append_dev(div14, hr1);
    			append_dev(div14, t11);
    			append_dev(div14, div12);
    			append_dev(div12, div7);
    			append_dev(div7, input0);
    			append_dev(div7, t12);
    			append_dev(div7, img0);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, input1);
    			append_dev(div11, t18);
    			append_dev(div11, img1);
    			append_dev(div11, t19);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t21);
    			append_dev(div10, div9);
    			append_dev(div14, t23);
    			append_dev(div14, hr2);
    			append_dev(div14, t24);
    			append_dev(div14, div13);
    			mount_component(button0, div13, null);
    			append_dev(div13, t25);
    			mount_component(button1, div13, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputxt0_changes = {};

    			if (!updating_bindvalue && dirty & /*challengename*/ 1) {
    				updating_bindvalue = true;
    				inputxt0_changes.bindvalue = /*challengename*/ ctx[0];
    				add_flush_callback(() => updating_bindvalue = false);
    			}

    			inputxt0.$set(inputxt0_changes);
    			const inputxt1_changes = {};

    			if (!updating_bindvalue_1 && dirty & /*description*/ 2) {
    				updating_bindvalue_1 = true;
    				inputxt1_changes.bindvalue = /*description*/ ctx[1];
    				add_flush_callback(() => updating_bindvalue_1 = false);
    			}

    			inputxt1.$set(inputxt1_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(inputxt0.$$.fragment, local);
    			transition_in(inputxt1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(inputxt0.$$.fragment, local);
    			transition_out(inputxt1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div15);
    			destroy_component(inputxt0);
    			destroy_component(inputxt1);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateChallenge', slots, []);
    	let challengename = "";
    	let description = ""; //임시 데이터.

    	function save() {
    		if (challengename == '') alert("이름을 입력해주세요."); else {
    			//store에 생성된 데이터 넘겨주기
    			alert(challengename + "이 생성되었습니다.");

    			push('/');
    		}
    	}

    	function cancel() {
    		alert("취소되었습니다.");
    		pop();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateChallenge> was created with unknown prop '${key}'`);
    	});

    	function inputxt0_bindvalue_binding(value) {
    		challengename = value;
    		$$invalidate(0, challengename);
    	}

    	function inputxt1_bindvalue_binding(value) {
    		description = value;
    		$$invalidate(1, description);
    	}

    	$$self.$capture_state = () => ({
    		push,
    		pop,
    		Button,
    		Inputxt,
    		GlobalNavigationBar,
    		challengename,
    		description,
    		save,
    		cancel
    	});

    	$$self.$inject_state = $$props => {
    		if ('challengename' in $$props) $$invalidate(0, challengename = $$props.challengename);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		challengename,
    		description,
    		save,
    		cancel,
    		inputxt0_bindvalue_binding,
    		inputxt1_bindvalue_binding
    	];
    }

    class CreateChallenge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateChallenge",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const challenge = [
        {
            title: '챌린지1 입니다.',
            description: '내 챌린지입니다',
            leader: 'llJTOll',
            count: 3
        },
        {
            title: '이 챌린지는 소개글이 없습니다',
            description: '',
            leader: 'user1',
            count: 2
        },
        {
            title: '챌린지3',
            description: '남의 챌린지입니다',
            leader: 'user2',
            count: 1
        }, //임시입니다. DB에서 목록 받아오기
    ];

    const challengelist = writable(challenge);

    /* src\components\ChallengeBox.svelte generated by Svelte v3.46.3 */
    const file$4 = "src\\components\\ChallengeBox.svelte";

    // (28:5) {#if isLeader}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon svelte-4854uc");
    			if (!src_url_equal(img.src, img_src_value = "images/setting.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "setting");
    			add_location(img, file$4, 28, 6, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(28:5) {#if isLeader}",
    		ctx
    	});

    	return block;
    }

    // (33:5) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon svelte-4854uc");
    			if (!src_url_equal(img.src, img_src_value = "images/staroutline.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "star_outline");
    			add_location(img, file$4, 33, 6, 785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickStar*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(33:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:5) {#if isStarred}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon svelte-4854uc");
    			if (!src_url_equal(img.src, img_src_value = "images/star.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "star");
    			add_location(img, file$4, 31, 6, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickStar*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:5) {#if isStarred}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div7;
    	let div3;
    	let div1;
    	let span0;
    	let t0_value = /*challenge*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = (/*challenge*/ ctx[1].description || '') + "";
    	let t4;
    	let t5;
    	let div6;
    	let div4;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let t7_value = (/*challenge*/ ctx[1].count || 0) + "";
    	let t7;
    	let t8;
    	let div5;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let t10_value = (/*challenge*/ ctx[1].leader || '') + "";
    	let t10;
    	let if_block0 = /*isLeader*/ ctx[2] && create_if_block_1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*isStarred*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			img0 = element("img");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			div5 = element("div");
    			img1 = element("img");
    			t9 = space();
    			t10 = text(t10_value);
    			attr_dev(span0, "class", "Box__header__title svelte-4854uc");
    			add_location(span0, file$4, 24, 3, 442);
    			add_location(span1, file$4, 26, 4, 542);
    			attr_dev(div0, "class", "Box__header__group");
    			add_location(div0, file$4, 25, 3, 504);
    			attr_dev(div1, "class", "Box__header svelte-4854uc");
    			add_location(div1, file$4, 23, 2, 412);
    			attr_dev(div2, "class", "Box__content");
    			add_location(div2, file$4, 38, 2, 930);
    			add_location(div3, file$4, 22, 1, 403);
    			attr_dev(img0, "class", "Box__icon svelte-4854uc");
    			if (!src_url_equal(img0.src, img0_src_value = "images/human.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "human");
    			add_location(img0, file$4, 44, 3, 1078);
    			attr_dev(div4, "class", "Box__footer__group svelte-4854uc");
    			add_location(div4, file$4, 43, 2, 1041);
    			attr_dev(img1, "class", "Box__icon svelte-4854uc");
    			if (!src_url_equal(img1.src, img1_src_value = "images/crown.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "crown");
    			add_location(img1, file$4, 48, 3, 1216);
    			attr_dev(div5, "class", "Box__footer__group svelte-4854uc");
    			add_location(div5, file$4, 47, 2, 1179);
    			attr_dev(div6, "class", "Box__footer svelte-4854uc");
    			add_location(div6, file$4, 42, 1, 1012);
    			attr_dev(div7, "class", "Box svelte-4854uc");
    			add_location(div7, file$4, 21, 0, 383);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			if (if_block0) if_block0.m(span1, null);
    			append_dev(span1, t2);
    			if_block1.m(span1, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, img0);
    			append_dev(div4, t6);
    			append_dev(div4, t7);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, img1);
    			append_dev(div5, t9);
    			append_dev(div5, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*challenge*/ 2 && t0_value !== (t0_value = /*challenge*/ ctx[1].title + "")) set_data_dev(t0, t0_value);

    			if (/*isLeader*/ ctx[2]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(span1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(span1, null);
    				}
    			}

    			if (dirty & /*challenge*/ 2 && t4_value !== (t4_value = (/*challenge*/ ctx[1].description || '') + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*challenge*/ 2 && t7_value !== (t7_value = (/*challenge*/ ctx[1].count || 0) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*challenge*/ 2 && t10_value !== (t10_value = (/*challenge*/ ctx[1].leader || '') + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onClickTitle() {
    	
    } // if(isMember)
    //	 push('/challengeDetail')

    function onClickSetting() {
    	
    } //push('/setting:id');

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChallengeBox', slots, []);
    	let { challenge } = $$props;
    	let { isLeader } = $$props;
    	let { isStarred } = $$props;

    	// else
    	// 	push('/signinChallenge?')
    	function onClickStar() {
    		$$invalidate(0, isStarred = !isStarred);
    	}

    	const writable_props = ['challenge', 'isLeader', 'isStarred'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChallengeBox> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('challenge' in $$props) $$invalidate(1, challenge = $$props.challenge);
    		if ('isLeader' in $$props) $$invalidate(2, isLeader = $$props.isLeader);
    		if ('isStarred' in $$props) $$invalidate(0, isStarred = $$props.isStarred);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		challenge,
    		isLeader,
    		isStarred,
    		onClickTitle,
    		onClickStar,
    		onClickSetting
    	});

    	$$self.$inject_state = $$props => {
    		if ('challenge' in $$props) $$invalidate(1, challenge = $$props.challenge);
    		if ('isLeader' in $$props) $$invalidate(2, isLeader = $$props.isLeader);
    		if ('isStarred' in $$props) $$invalidate(0, isStarred = $$props.isStarred);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isStarred, challenge, isLeader, onClickStar];
    }

    class ChallengeBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { challenge: 1, isLeader: 2, isStarred: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChallengeBox",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*challenge*/ ctx[1] === undefined && !('challenge' in props)) {
    			console.warn("<ChallengeBox> was created without expected prop 'challenge'");
    		}

    		if (/*isLeader*/ ctx[2] === undefined && !('isLeader' in props)) {
    			console.warn("<ChallengeBox> was created without expected prop 'isLeader'");
    		}

    		if (/*isStarred*/ ctx[0] === undefined && !('isStarred' in props)) {
    			console.warn("<ChallengeBox> was created without expected prop 'isStarred'");
    		}
    	}

    	get challenge() {
    		throw new Error("<ChallengeBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set challenge(value) {
    		throw new Error("<ChallengeBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLeader() {
    		throw new Error("<ChallengeBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLeader(value) {
    		throw new Error("<ChallengeBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStarred() {
    		throw new Error("<ChallengeBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStarred(value) {
    		throw new Error("<ChallengeBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\MyChallengeList.svelte generated by Svelte v3.46.3 */
    const file$3 = "src\\pages\\MyChallengeList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (27:5) {#each $challengelist as c}
    function create_each_block$1(ctx) {
    	let challengebox;
    	let current;

    	challengebox = new ChallengeBox({
    			props: { challenge: /*c*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(challengebox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(challengebox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const challengebox_changes = {};
    			if (dirty & /*$challengelist*/ 1) challengebox_changes.challenge = /*c*/ ctx[1];
    			challengebox.$set(challengebox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(challengebox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(challengebox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(challengebox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:5) {#each $challengelist as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div1;
    	let profile;
    	let t1;
    	let div0;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	profile = new Profile({ $$inline: true });
    	let each_value = /*$challengelist*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(profile.$$.fragment);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "MyChallengeList__content svelte-dd2svf");
    			add_location(div0, file$3, 25, 1, 692);
    			attr_dev(div1, "class", "MyChallengeList svelte-dd2svf");
    			add_location(div1, file$3, 23, 0, 646);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(profile, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$challengelist*/ 1) {
    				each_value = /*$challengelist*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(profile);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onClick() {
    	alert('new Challenge!');
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $challengelist;
    	validate_store(challengelist, 'challengelist');
    	component_subscribe($$self, challengelist, $$value => $$invalidate(0, $challengelist = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyChallengeList', slots, []);

    	onMount(() => {
    		changeTab(index.MYCHALLENGE);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyChallengeList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		push,
    		changeTab,
    		challengelist,
    		index,
    		GlobalNavigationBar,
    		Profile,
    		ChallengeBox,
    		Button,
    		onClick,
    		$challengelist
    	});

    	return [$challengelist];
    }

    class MyChallengeList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyChallengeList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\TotalChallengeList.svelte generated by Svelte v3.46.3 */
    const file$2 = "src\\pages\\TotalChallengeList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (26:8) {#each $challengelist as c}
    function create_each_block(ctx) {
    	let challengebox;
    	let current;

    	challengebox = new ChallengeBox({
    			props: { challenge: /*c*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(challengebox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(challengebox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const challengebox_changes = {};
    			if (dirty & /*$challengelist*/ 1) challengebox_changes.challenge = /*c*/ ctx[1];
    			challengebox.$set(challengebox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(challengebox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(challengebox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(challengebox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:8) {#each $challengelist as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div6;
    	let profile;
    	let t1;
    	let div5;
    	let div0;
    	let inputxt;
    	let t2;
    	let div4;
    	let div1;
    	let t4;
    	let div2;
    	let t6;
    	let div3;
    	let t8;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	profile = new Profile({ $$inline: true });

    	inputxt = new Inputxt({
    			props: { placeholder: "검색할 내용을 입력하세요" },
    			$$inline: true
    		});

    	let each_value = /*$challengelist*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			create_component(profile.$$.fragment);
    			t1 = space();
    			div5 = element("div");
    			div0 = element("div");
    			create_component(inputxt.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div1.textContent = "TITLE";
    			t4 = space();
    			div2 = element("div");
    			div2.textContent = "DESCRIPTION";
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = "LEADER";
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "Page__search");
    			add_location(div0, file$2, 17, 8, 474);
    			attr_dev(div1, "class", "Page__sort__font svelte-yrypzb");
    			add_location(div1, file$2, 21, 12, 616);
    			attr_dev(div2, "class", "Page__sort__font svelte-yrypzb");
    			add_location(div2, file$2, 22, 12, 673);
    			attr_dev(div3, "class", "Page__sort__font svelte-yrypzb");
    			add_location(div3, file$2, 23, 12, 736);
    			attr_dev(div4, "class", "Page__sort svelte-yrypzb");
    			add_location(div4, file$2, 20, 8, 578);
    			attr_dev(div5, "class", "Page__content svelte-yrypzb");
    			add_location(div5, file$2, 16, 4, 437);
    			attr_dev(div6, "class", "Page svelte-yrypzb");
    			add_location(div6, file$2, 14, 0, 396);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(profile, div6, null);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			mount_component(inputxt, div0, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div5, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$challengelist*/ 1) {
    				each_value = /*$challengelist*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			transition_in(inputxt.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(inputxt.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);
    			destroy_component(profile);
    			destroy_component(inputxt);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $challengelist;
    	validate_store(challengelist, 'challengelist');
    	component_subscribe($$self, challengelist, $$value => $$invalidate(0, $challengelist = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TotalChallengeList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TotalChallengeList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		challengelist,
    		Profile,
    		GlobalNavigationBar,
    		ChallengeBox,
    		Inputxt,
    		$challengelist
    	});

    	return [$challengelist];
    }

    class TotalChallengeList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TotalChallengeList",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\NotFound.svelte generated by Svelte v3.46.3 */
    const file$1 = "src\\pages\\NotFound.svelte";

    // (16:1) <Button {onClick}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("홈으로 가기");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(16:1) <Button {onClick}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				onClick: /*onClick*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "404";
    			t1 = space();
    			span1 = element("span");
    			t2 = text("찾을 수 없는 페이지입니다.");
    			br = element("br");
    			t3 = text("\r\n\t\t요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.");
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(span0, "class", "NotFound__head svelte-neg4to");
    			add_location(span0, file$1, 10, 1, 176);
    			add_location(br, file$1, 12, 17, 265);
    			attr_dev(span1, "class", "NotFound__sub svelte-neg4to");
    			add_location(span1, file$1, 11, 1, 218);
    			attr_dev(div, "class", "NotFound svelte-neg4to");
    			add_location(div, file$1, 9, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    			append_dev(span1, br);
    			append_dev(span1, t3);
    			append_dev(div, t4);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);

    	function onClick() {
    		push('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ push, Button, onClick });
    	return [onClick];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var routes = {
    	'/': Home,
    	'/login' : Login,
    	'/setting/:id' : Setting,
    	'/challenge/:id' : ChallengeDetail,
    	'/createchallenge': CreateChallenge,
    	'/mychallenge' : MyChallengeList, // TODO: 사람 별로 페이지를 가질지 결정 후 변경
    	'/totalchallenge' : TotalChallengeList,
    	'*': NotFound,
    };

    /* src\App.svelte generated by Svelte v3.46.3 */
    const file = "src\\App.svelte";

    // (12:2) <Container>
    function create_default_slot(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div;
    	let container;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(container.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "body svelte-fvo70l");
    			add_location(div, file, 10, 1, 300);
    			set_style(main, "height", "100%");
    			add_location(main, file, 8, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(container, div, null);
    			append_dev(main, t1);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(container.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(container.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(container);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		Container,
    		Router,
    		routes
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
