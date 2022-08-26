
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

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

    function parse$1(str, loose) {
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

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.3 */

    const { Error: Error_1, Object: Object_1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$b(ctx) {
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
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$d(ctx) {
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$b];
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
    		id: create_fragment$y.name,
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

    const location$2 = derived(loc, $loc => $loc.location);
    const querystring$1 = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push$1(location) {
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

    function instance$y($$self, $$props, $$invalidate) {
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

    			const { pattern, keys } = parse$1(path);
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
    		location: location$2,
    		querystring: querystring$1,
    		params,
    		push: push$1,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse: parse$1,
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

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$y.name
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

    const GIT_URL = "https://github.com";
    const API_URL = "https://grabit-backend-zjppc.run.goorm.io/api";
    const CALLBACK_URL = "http://localhost:5000/";
    const ACCESS_TOKEN = 'accessToken';

    function getHeader() {
    	const bearer = 'Bearer ' + window.localStorage.getItem(ACCESS_TOKEN);
    	return { 'Authorization': bearer };
    }

    const bearer = getHeader();

    function getQueryUri(params = {}) {
    	const query = Object.keys(params)
    				.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    				.join('&');
    	return query;
    }

    async function fetchGet(path, otherOptions = {}, headers = {}) {
    	const url = `${API_URL}/${path}`;

    	const options = {
    		method: 'GET',
    		headers: {
    			...bearer,
    			...headers,
    		},
    		...otherOptions
    	};
    	
    	let data;
    	let res;

    	try{
    		res = await fetch(url, options);
    		data = await res.json();
    	} catch(error) {
    		data = { err: error.name, errMsg: error.message, status: res.status };
    	}

    	return data;
    }

    async function fetchGetRedirectUrl(path, options = {}) {
    	const url = `${API_URL}/${path}`;

    	const res = await fetch(url, options);

    	window.location.href = res.url;
    }

    async function fetchPost(path, body, otherOptions = {}, headers = {}) {
    	const url = `${API_URL}/${path}`;
    	const options = {
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			...bearer,
    			...headers,
    		},
    		body: JSON.stringify(body),
    		...otherOptions
    	};

    	const res = await fetch(url, options);
    	const data = await res.json();

    	/* TODO: Error 처리
    		if (res.ok) {
    			return data;
    		} else {
    			throw Error(data);
    		}
    	*/

    	return data;
    }
    async function fetchPostFormData(path, body, otherOptions = {}, headers = {}) {

    	const url = `${API_URL}/${path}`;
    	const options = {
    		method: "POST",
    		headers: {
    			...bearer,
    			...headers,
    		},
    		body, 
    		...otherOptions
    	};

    	const res = await fetch(url, options);
    	const data = await res.json();

    	return data;
    }

    async function fetchPatch(path, body, otherOptions = {}, headers = {}) {
    	const url = `${API_URL}/${path}`;

    	const options = {
    		method: "PATCH",
    		headers: {
    			"Content-Type": "application/json",
    			...bearer,
    			...headers,
    		},
    		body: JSON.stringify(body),
    		...otherOptions
    	};

    	const res = await fetch(url, options);
    	const data = await res.json();

    	return data;
    }

    async function fetchDelete(path, otherOptions = {}, headers = {}) {
    	const url = `${API_URL}/${path}`;

    	const options = {
    		method: "DELETE",
    		headers: {
    			...bearer,
    			...headers
    		},
    		...otherOptions
    	};

    	const res = await fetch(url, options);
    	const data = await res.json();

    	return data;
    }

    const user = writable(null);

    async function login() {
    	await fetchGetRedirectUrl(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : CALLBACK_URL+'#/redirect'})}`, {redirect: 'manual'});
    }

    function logout() {
    	user.set(null);
    	localStorage.removeItem(ACCESS_TOKEN);
    }

    function failLogin() {
    	window.location.href = '/#/login';
    }

    function setUserToken() {
    	const url = location.href;
    	const token = url.split('?')[1].split('=')[1].split('#')[0];

    	// TODO: 로그인 실패시 토스트 알럿 띄우기
    	if(!token) failLogin();
    	localStorage.setItem(ACCESS_TOKEN, token);

    	window.location.href = url.split('?')[0];
    }

    async function getUser() {
    	// TODO: 로그인 실패시 토스트 알럿 띄우기
    	const userData = await fetchGet('users');
    	if(userData.err) failLogin();
    	else user.set(userData);
    }

    /* src/storybook/Button.svelte generated by Svelte v3.46.3 */

    const file$w = "src/storybook/Button.svelte";

    function create_fragment$x(ctx) {
    	let button;
    	let button_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "Button svelte-16fd8kf");
    			attr_dev(button, "style", button_style_value = "--width: " + (/*width*/ ctx[0] || 'fit-content') + "; --height: " + (/*height*/ ctx[1] || 'fit-content') + "; --backgroundColor: " + (/*backgroundColor*/ ctx[2] || 'white') + "; " + /*style*/ ctx[3] + "");
    			add_location(button, file$w, 8, 0, 128);
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
    						if (is_function(/*onClick*/ ctx[4])) /*onClick*/ ctx[4].apply(this, arguments);
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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*width, height, backgroundColor, style*/ 15 && button_style_value !== (button_style_value = "--width: " + (/*width*/ ctx[0] || 'fit-content') + "; --height: " + (/*height*/ ctx[1] || 'fit-content') + "; --backgroundColor: " + (/*backgroundColor*/ ctx[2] || 'white') + "; " + /*style*/ ctx[3] + "")) {
    				attr_dev(button, "style", button_style_value);
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { backgroundColor } = $$props;
    	let { style } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['width', 'height', 'backgroundColor', 'style', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(2, backgroundColor = $$props.backgroundColor);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('onClick' in $$props) $$invalidate(4, onClick = $$props.onClick);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		width,
    		height,
    		backgroundColor,
    		style,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(2, backgroundColor = $$props.backgroundColor);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('onClick' in $$props) $$invalidate(4, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, backgroundColor, style, onClick, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			width: 0,
    			height: 1,
    			backgroundColor: 2,
    			style: 3,
    			onClick: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$x.name
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

    		if (/*style*/ ctx[3] === undefined && !('style' in props)) {
    			console.warn("<Button> was created without expected prop 'style'");
    		}

    		if (/*onClick*/ ctx[4] === undefined && !('onClick' in props)) {
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

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/storybook/Dropdown.svelte generated by Svelte v3.46.3 */
    const file$v = "src/storybook/Dropdown.svelte";

    // (24:0) {#if open}
    function create_if_block$c(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "Dropdown " + /*rightCss*/ ctx[1] + " svelte-1g464mq");
    			add_location(div, file$v, 24, 1, 458);
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

    			if (!current || dirty & /*rightCss*/ 2 && div_class_value !== (div_class_value = "Dropdown " + /*rightCss*/ ctx[1] + " svelte-1g464mq")) {
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(24:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && create_if_block$c(ctx);

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
    					if_block = create_if_block$c(ctx);
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { onClickOut: 2, open: 0, right: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$w.name
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

    /* src/storybook/DropdownItem.svelte generated by Svelte v3.46.3 */

    const file$u = "src/storybook/DropdownItem.svelte";

    function create_fragment$v(ctx) {
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
    			attr_dev(div, "class", "DropdownItem svelte-en4eg9");
    			add_location(div, file$u, 4, 0, 41);
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownItem",
    			options,
    			id: create_fragment$v.name
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

    /* src/storybook/SearchInput.svelte generated by Svelte v3.46.3 */

    const file$t = "src/storybook/SearchInput.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let input;
    	let t;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			img = element("img");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search...");
    			attr_dev(input, "class", "svelte-1bs1bc9");
    			add_location(input, file$t, 15, 4, 273);
    			attr_dev(img, "class", "search__icon svelte-1bs1bc9");
    			if (!src_url_equal(img.src, img_src_value = "images/search.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "search_img");
    			add_location(img, file$t, 22, 4, 429);
    			attr_dev(div, "class", "search svelte-1bs1bc9");
    			add_location(div, file$t, 14, 0, 248);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*searchVal*/ ctx[0]);
    			append_dev(div, t);
    			append_dev(div, img);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keypress", /*onKeyPress*/ ctx[1], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "input", /*onChange*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchVal*/ 1 && input.value !== /*searchVal*/ ctx[0]) {
    				set_input_value(input, /*searchVal*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInput', slots, []);
    	let { searchHandler } = $$props;
    	let { changeHandler } = $$props;
    	let searchVal = "";

    	const onKeyPress = e => {
    		if (e.charCode === 13) searchHandler(searchVal);
    	};

    	const onChange = () => {
    		changeHandler(searchVal);
    	};

    	const writable_props = ['searchHandler', 'changeHandler'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchVal = this.value;
    		$$invalidate(0, searchVal);
    	}

    	$$self.$$set = $$props => {
    		if ('searchHandler' in $$props) $$invalidate(3, searchHandler = $$props.searchHandler);
    		if ('changeHandler' in $$props) $$invalidate(4, changeHandler = $$props.changeHandler);
    	};

    	$$self.$capture_state = () => ({
    		searchHandler,
    		changeHandler,
    		searchVal,
    		onKeyPress,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchHandler' in $$props) $$invalidate(3, searchHandler = $$props.searchHandler);
    		if ('changeHandler' in $$props) $$invalidate(4, changeHandler = $$props.changeHandler);
    		if ('searchVal' in $$props) $$invalidate(0, searchVal = $$props.searchVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchVal,
    		onKeyPress,
    		onChange,
    		searchHandler,
    		changeHandler,
    		input_input_handler
    	];
    }

    class SearchInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { searchHandler: 3, changeHandler: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInput",
    			options,
    			id: create_fragment$u.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*searchHandler*/ ctx[3] === undefined && !('searchHandler' in props)) {
    			console.warn("<SearchInput> was created without expected prop 'searchHandler'");
    		}

    		if (/*changeHandler*/ ctx[4] === undefined && !('changeHandler' in props)) {
    			console.warn("<SearchInput> was created without expected prop 'changeHandler'");
    		}
    	}

    	get searchHandler() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchHandler(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeHandler() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeHandler(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/storybook/Input.svelte generated by Svelte v3.46.3 */

    const file$s = "src/storybook/Input.svelte";

    function create_fragment$t(ctx) {
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
    			attr_dev(input, "class", "svelte-1mc8ucc");
    			add_location(input, file$s, 7, 0, 109);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { bindvalue } = $$props;
    	let { size } = $$props;
    	let { maxlength } = $$props;
    	let { placeholder } = $$props;
    	const writable_props = ['bindvalue', 'size', 'maxlength', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
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

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			bindvalue: 0,
    			size: 1,
    			maxlength: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bindvalue*/ ctx[0] === undefined && !('bindvalue' in props)) {
    			console.warn("<Input> was created without expected prop 'bindvalue'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Input> was created without expected prop 'size'");
    		}

    		if (/*maxlength*/ ctx[2] === undefined && !('maxlength' in props)) {
    			console.warn("<Input> was created without expected prop 'maxlength'");
    		}

    		if (/*placeholder*/ ctx[3] === undefined && !('placeholder' in props)) {
    			console.warn("<Input> was created without expected prop 'placeholder'");
    		}
    	}

    	get bindvalue() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bindvalue(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxlength() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxlength(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/storybook/Loader.svelte generated by Svelte v3.46.3 */

    const file$r = "src/storybook/Loader.svelte";

    function create_fragment$s(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "Loader svelte-s36wix");
    			set_style(div, "--color", /*color*/ ctx[0] || 'var(--main-green-darker-color)');
    			add_location(div, file$r, 4, 0, 39);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0] || 'var(--main-green-darker-color)');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { color } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console.warn("<Loader> was created without expected prop 'color'");
    		}
    	}

    	get color() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/storybook/SubNavigation.svelte generated by Svelte v3.46.3 */

    const file$q = "src/storybook/SubNavigation.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "SubNavigation svelte-zt0xir");
    			add_location(div, file$q, 3, 0, 20);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigation",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src/storybook/SubNavigationItem.svelte generated by Svelte v3.46.3 */
    const file$p = "src/storybook/SubNavigationItem.svelte";

    // (14:1) {#if isActive}
    function create_if_block$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "SubNavigationItem__active svelte-1697sdr");
    			add_location(div, file$p, 14, 2, 300);
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(14:1) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isActive*/ ctx[1] && create_if_block$b(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "SubNavigationItem " + /*activeCss*/ ctx[2] + " svelte-1697sdr");
    			add_location(div, file$p, 12, 0, 219);
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
    					if_block = create_if_block$b(ctx);
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

    			if (!current || dirty & /*activeCss*/ 4 && div_class_value !== (div_class_value = "SubNavigationItem " + /*activeCss*/ ctx[2] + " svelte-1697sdr")) {
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { onClick: 0, isActive: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigationItem",
    			options,
    			id: create_fragment$q.name
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

    /* src/storybook/Card.svelte generated by Svelte v3.46.3 */

    const file$o = "src/storybook/Card.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Card svelte-m3r2mx");
    			add_location(div, file$o, 3, 0, 20);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.46.3 */
    const file$n = "src/components/Header.svelte";

    // (41:2) {:else}
    function create_else_block$a(ctx) {
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
    				open: /*isOpenDropdown*/ ctx[0],
    				onClickOut: /*onClickOut*/ ctx[3],
    				right: true,
    				$$slots: { default: [create_default_slot_3] },
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
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "default_image_grabit_logo");
    			attr_dev(img, "class", "header__profile__img svelte-15ml67a");
    			add_location(img, file$n, 42, 4, 1175);
    			attr_dev(span, "class", "header__profile svelte-15ml67a");
    			add_location(span, file$n, 41, 3, 1140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, img);
    			append_dev(span, t);
    			mount_component(dropdown, span, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickProfile*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};
    			if (dirty & /*isOpenDropdown*/ 1) dropdown_changes.open = /*isOpenDropdown*/ ctx[0];

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
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(41:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:2) {#if $user}
    function create_if_block$a(ctx) {
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
    				open: /*isOpenDropdown*/ ctx[0],
    				onClickOut: /*onClickOut*/ ctx[3],
    				right: true,
    				$$slots: { default: [create_default_slot$c] },
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
    			if (!src_url_equal(img.src, img_src_value = /*$user*/ ctx[1].profileImg || GIT_URL + '/' + /*$user*/ ctx[1].githubId + '.png')) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "header__profile__img svelte-15ml67a");
    			add_location(img, file$n, 29, 4, 775);
    			attr_dev(span, "class", "header__profile svelte-15ml67a");
    			add_location(span, file$n, 28, 3, 740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, img);
    			append_dev(span, t);
    			mount_component(dropdown, span, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickProfile*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$user*/ 2 && !src_url_equal(img.src, img_src_value = /*$user*/ ctx[1].profileImg || GIT_URL + '/' + /*$user*/ ctx[1].githubId + '.png')) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const dropdown_changes = {};
    			if (dirty & /*isOpenDropdown*/ 1) dropdown_changes.open = /*isOpenDropdown*/ ctx[0];

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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(28:2) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (50:5) <DropdownItem onClick={()=>{push('/login')}}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("로그인");
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(50:5) <DropdownItem onClick={()=>{push('/login')}}>",
    		ctx
    	});

    	return block;
    }

    // (49:4) <Dropdown open={isOpenDropdown} {onClickOut} right>
    function create_default_slot_3(ctx) {
    	let dropdownitem;
    	let current;

    	dropdownitem = new DropdownItem({
    			props: {
    				onClick: /*func*/ ctx[5],
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				dropdownitem_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem.$set(dropdownitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(49:4) <Dropdown open={isOpenDropdown} {onClickOut} right>",
    		ctx
    	});

    	return block;
    }

    // (37:5) <DropdownItem onClick=''>
    function create_default_slot_2$1(ctx) {
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(37:5) <DropdownItem onClick=''>",
    		ctx
    	});

    	return block;
    }

    // (38:5) <DropdownItem onClick={logout}>
    function create_default_slot_1$8(ctx) {
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
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(38:5) <DropdownItem onClick={logout}>",
    		ctx
    	});

    	return block;
    }

    // (36:4) <Dropdown open={isOpenDropdown} {onClickOut} right>
    function create_default_slot$c(ctx) {
    	let dropdownitem0;
    	let t;
    	let dropdownitem1;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				onClick: "",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				onClick: logout,
    				$$slots: { default: [create_default_slot_1$8] },
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
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(36:4) <Dropdown open={isOpenDropdown} {onClickOut} right>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
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
    	const if_block_creators = [create_if_block$a, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[1]) return 0;
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
    			attr_dev(img, "class", "header__logo__img svelte-15ml67a");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$n, 22, 3, 588);
    			attr_dev(div0, "class", "header__title svelte-15ml67a");
    			add_location(div0, file$n, 23, 3, 665);
    			attr_dev(div1, "class", "header__logo svelte-15ml67a");
    			add_location(div1, file$n, 21, 2, 531);
    			attr_dev(div2, "class", "header__container svelte-15ml67a");
    			add_location(div2, file$n, 20, 1, 497);
    			attr_dev(div3, "class", "header svelte-15ml67a");
    			add_location(div3, file$n, 19, 0, 475);
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
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const name = "Grabit";

    function instance$o($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let src = '';
    	let isOpenDropdown = false;

    	const onClickProfile = () => {
    		$$invalidate(0, isOpenDropdown = !isOpenDropdown);
    	};

    	const onClickOut = () => {
    		$$invalidate(0, isOpenDropdown = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		push$1('/');
    	};

    	const func = () => {
    		push$1('/login');
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		link,
    		push: push$1,
    		user,
    		logout,
    		GIT_URL,
    		Dropdown,
    		DropdownItem,
    		name,
    		src,
    		isOpenDropdown,
    		onClickProfile,
    		onClickOut,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) src = $$props.src;
    		if ('isOpenDropdown' in $$props) $$invalidate(0, isOpenDropdown = $$props.isOpenDropdown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpenDropdown, $user, onClickProfile, onClickOut, click_handler, func];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.46.3 */

    const file$m = "src/components/Footer.svelte";

    function create_fragment$n(ctx) {
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
    			attr_dev(img, "class", "logo_img svelte-un0msu");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$m, 6, 3, 100);
    			attr_dev(div0, "class", "footer_title svelte-un0msu");
    			add_location(div0, file$m, 7, 3, 168);
    			attr_dev(div1, "class", "footer_logo svelte-un0msu");
    			add_location(div1, file$m, 5, 2, 71);
    			attr_dev(div2, "class", "menu_text svelte-un0msu");
    			add_location(div2, file$m, 10, 3, 257);
    			attr_dev(div3, "class", "menu_text svelte-un0msu");
    			add_location(div3, file$m, 11, 3, 295);
    			attr_dev(div4, "class", "menu_text svelte-un0msu");
    			add_location(div4, file$m, 12, 3, 332);
    			attr_dev(div5, "class", "menu_text svelte-un0msu");
    			add_location(div5, file$m, 13, 3, 373);
    			attr_dev(div6, "class", "footer_menu svelte-un0msu");
    			add_location(div6, file$m, 9, 2, 228);
    			attr_dev(div7, "class", "footer_inner svelte-un0msu");
    			add_location(div7, file$m, 4, 1, 42);
    			attr_dev(div8, "class", "footer svelte-un0msu");
    			add_location(div8, file$m, 3, 0, 20);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/components/Container.svelte generated by Svelte v3.46.3 */

    const file$l = "src/components/Container.svelte";

    function create_fragment$m(ctx) {
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
    			attr_dev(div0, "class", "container svelte-40xe32");
    			add_location(div0, file$l, 5, 1, 54);
    			attr_dev(div1, "class", "container_outside svelte-40xe32");
    			add_location(div1, file$l, 4, 0, 21);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    const initialState$1 = [];

    let myChallengeList = writable(initialState$1);
    let myChallengePage = writable(1);

    async function getUserChallenge() {
    	const res = await fetchGet(`users/challenges`);
    	myChallengeList.set(res.content);
    	myChallengePage.set(res.totalPages);
    	return res.content;
    }

    function useEffect(cb, deps) {
    	let cleanup;
    	
    	function apply() {
    		if (cleanup) cleanup();
    		cleanup = cb();
    	}
    	
    	if (deps) {
    		let values = [];
    		afterUpdate(() => {
    			const new_values = deps();
    			if (new_values.some((value, i) => value !== values[i])) {
    				apply();
    				values = new_values;
    			}
    		});
    	} else {
    		// no deps = always run
    		afterUpdate(apply);
    	}
    	
    	onDestroy(() => {
    		if (cleanup) cleanup();
    	});
    }

    /**
     * Some byte values, used as per STOMP specifications.
     *
     * Part of `@stomp/stompjs`.
     *
     * @internal
     */
    const BYTE = {
        // LINEFEED byte (octet 10)
        LF: '\x0A',
        // NULL byte (octet 0)
        NULL: '\x00',
    };

    /**
     * Frame class represents a STOMP frame.
     *
     * @internal
     */
    class FrameImpl {
        /**
         * Frame constructor. `command`, `headers` and `body` are available as properties.
         *
         * @internal
         */
        constructor(params) {
            const { command, headers, body, binaryBody, escapeHeaderValues, skipContentLengthHeader, } = params;
            this.command = command;
            this.headers = Object.assign({}, headers || {});
            if (binaryBody) {
                this._binaryBody = binaryBody;
                this.isBinaryBody = true;
            }
            else {
                this._body = body || '';
                this.isBinaryBody = false;
            }
            this.escapeHeaderValues = escapeHeaderValues || false;
            this.skipContentLengthHeader = skipContentLengthHeader || false;
        }
        /**
         * body of the frame
         */
        get body() {
            if (!this._body && this.isBinaryBody) {
                this._body = new TextDecoder().decode(this._binaryBody);
            }
            return this._body;
        }
        /**
         * body as Uint8Array
         */
        get binaryBody() {
            if (!this._binaryBody && !this.isBinaryBody) {
                this._binaryBody = new TextEncoder().encode(this._body);
            }
            return this._binaryBody;
        }
        /**
         * deserialize a STOMP Frame from raw data.
         *
         * @internal
         */
        static fromRawFrame(rawFrame, escapeHeaderValues) {
            const headers = {};
            const trim = (str) => str.replace(/^\s+|\s+$/g, '');
            // In case of repeated headers, as per standards, first value need to be used
            for (const header of rawFrame.headers.reverse()) {
                header.indexOf(':');
                const key = trim(header[0]);
                let value = trim(header[1]);
                if (escapeHeaderValues &&
                    rawFrame.command !== 'CONNECT' &&
                    rawFrame.command !== 'CONNECTED') {
                    value = FrameImpl.hdrValueUnEscape(value);
                }
                headers[key] = value;
            }
            return new FrameImpl({
                command: rawFrame.command,
                headers,
                binaryBody: rawFrame.binaryBody,
                escapeHeaderValues,
            });
        }
        /**
         * @internal
         */
        toString() {
            return this.serializeCmdAndHeaders();
        }
        /**
         * serialize this Frame in a format suitable to be passed to WebSocket.
         * If the body is string the output will be string.
         * If the body is binary (i.e. of type Unit8Array) it will be serialized to ArrayBuffer.
         *
         * @internal
         */
        serialize() {
            const cmdAndHeaders = this.serializeCmdAndHeaders();
            if (this.isBinaryBody) {
                return FrameImpl.toUnit8Array(cmdAndHeaders, this._binaryBody).buffer;
            }
            else {
                return cmdAndHeaders + this._body + BYTE.NULL;
            }
        }
        serializeCmdAndHeaders() {
            const lines = [this.command];
            if (this.skipContentLengthHeader) {
                delete this.headers['content-length'];
            }
            for (const name of Object.keys(this.headers || {})) {
                const value = this.headers[name];
                if (this.escapeHeaderValues &&
                    this.command !== 'CONNECT' &&
                    this.command !== 'CONNECTED') {
                    lines.push(`${name}:${FrameImpl.hdrValueEscape(`${value}`)}`);
                }
                else {
                    lines.push(`${name}:${value}`);
                }
            }
            if (this.isBinaryBody ||
                (!this.isBodyEmpty() && !this.skipContentLengthHeader)) {
                lines.push(`content-length:${this.bodyLength()}`);
            }
            return lines.join(BYTE.LF) + BYTE.LF + BYTE.LF;
        }
        isBodyEmpty() {
            return this.bodyLength() === 0;
        }
        bodyLength() {
            const binaryBody = this.binaryBody;
            return binaryBody ? binaryBody.length : 0;
        }
        /**
         * Compute the size of a UTF-8 string by counting its number of bytes
         * (and not the number of characters composing the string)
         */
        static sizeOfUTF8(s) {
            return s ? new TextEncoder().encode(s).length : 0;
        }
        static toUnit8Array(cmdAndHeaders, binaryBody) {
            const uint8CmdAndHeaders = new TextEncoder().encode(cmdAndHeaders);
            const nullTerminator = new Uint8Array([0]);
            const uint8Frame = new Uint8Array(uint8CmdAndHeaders.length + binaryBody.length + nullTerminator.length);
            uint8Frame.set(uint8CmdAndHeaders);
            uint8Frame.set(binaryBody, uint8CmdAndHeaders.length);
            uint8Frame.set(nullTerminator, uint8CmdAndHeaders.length + binaryBody.length);
            return uint8Frame;
        }
        /**
         * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
         *
         * @internal
         */
        static marshall(params) {
            const frame = new FrameImpl(params);
            return frame.serialize();
        }
        /**
         *  Escape header values
         */
        static hdrValueEscape(str) {
            return str
                .replace(/\\/g, '\\\\')
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n')
                .replace(/:/g, '\\c');
        }
        /**
         * UnEscape header values
         */
        static hdrValueUnEscape(str) {
            return str
                .replace(/\\r/g, '\r')
                .replace(/\\n/g, '\n')
                .replace(/\\c/g, ':')
                .replace(/\\\\/g, '\\');
        }
    }

    /**
     * @internal
     */
    const NULL = 0;
    /**
     * @internal
     */
    const LF = 10;
    /**
     * @internal
     */
    const CR = 13;
    /**
     * @internal
     */
    const COLON = 58;
    /**
     * This is an evented, rec descent parser.
     * A stream of Octets can be passed and whenever it recognizes
     * a complete Frame or an incoming ping it will invoke the registered callbacks.
     *
     * All incoming Octets are fed into _onByte function.
     * Depending on current state the _onByte function keeps changing.
     * Depending on the state it keeps accumulating into _token and _results.
     * State is indicated by current value of _onByte, all states are named as _collect.
     *
     * STOMP standards https://stomp.github.io/stomp-specification-1.2.html
     * imply that all lengths are considered in bytes (instead of string lengths).
     * So, before actual parsing, if the incoming data is String it is converted to Octets.
     * This allows faithful implementation of the protocol and allows NULL Octets to be present in the body.
     *
     * There is no peek function on the incoming data.
     * When a state change occurs based on an Octet without consuming the Octet,
     * the Octet, after state change, is fed again (_reinjectByte).
     * This became possible as the state change can be determined by inspecting just one Octet.
     *
     * There are two modes to collect the body, if content-length header is there then it by counting Octets
     * otherwise it is determined by NULL terminator.
     *
     * Following the standards, the command and headers are converted to Strings
     * and the body is returned as Octets.
     * Headers are returned as an array and not as Hash - to allow multiple occurrence of an header.
     *
     * This parser does not use Regular Expressions as that can only operate on Strings.
     *
     * It handles if multiple STOMP frames are given as one chunk, a frame is split into multiple chunks, or
     * any combination there of. The parser remembers its state (any partial frame) and continues when a new chunk
     * is pushed.
     *
     * Typically the higher level function will convert headers to Hash, handle unescaping of header values
     * (which is protocol version specific), and convert body to text.
     *
     * Check the parser.spec.js to understand cases that this parser is supposed to handle.
     *
     * Part of `@stomp/stompjs`.
     *
     * @internal
     */
    class Parser {
        constructor(onFrame, onIncomingPing) {
            this.onFrame = onFrame;
            this.onIncomingPing = onIncomingPing;
            this._encoder = new TextEncoder();
            this._decoder = new TextDecoder();
            this._token = [];
            this._initState();
        }
        parseChunk(segment, appendMissingNULLonIncoming = false) {
            let chunk;
            if (segment instanceof ArrayBuffer) {
                chunk = new Uint8Array(segment);
            }
            else {
                chunk = this._encoder.encode(segment);
            }
            // See https://github.com/stomp-js/stompjs/issues/89
            // Remove when underlying issue is fixed.
            //
            // Send a NULL byte, if the last byte of a Text frame was not NULL.F
            if (appendMissingNULLonIncoming && chunk[chunk.length - 1] !== 0) {
                const chunkWithNull = new Uint8Array(chunk.length + 1);
                chunkWithNull.set(chunk, 0);
                chunkWithNull[chunk.length] = 0;
                chunk = chunkWithNull;
            }
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < chunk.length; i++) {
                const byte = chunk[i];
                this._onByte(byte);
            }
        }
        // The following implements a simple Rec Descent Parser.
        // The grammar is simple and just one byte tells what should be the next state
        _collectFrame(byte) {
            if (byte === NULL) {
                // Ignore
                return;
            }
            if (byte === CR) {
                // Ignore CR
                return;
            }
            if (byte === LF) {
                // Incoming Ping
                this.onIncomingPing();
                return;
            }
            this._onByte = this._collectCommand;
            this._reinjectByte(byte);
        }
        _collectCommand(byte) {
            if (byte === CR) {
                // Ignore CR
                return;
            }
            if (byte === LF) {
                this._results.command = this._consumeTokenAsUTF8();
                this._onByte = this._collectHeaders;
                return;
            }
            this._consumeByte(byte);
        }
        _collectHeaders(byte) {
            if (byte === CR) {
                // Ignore CR
                return;
            }
            if (byte === LF) {
                this._setupCollectBody();
                return;
            }
            this._onByte = this._collectHeaderKey;
            this._reinjectByte(byte);
        }
        _reinjectByte(byte) {
            this._onByte(byte);
        }
        _collectHeaderKey(byte) {
            if (byte === COLON) {
                this._headerKey = this._consumeTokenAsUTF8();
                this._onByte = this._collectHeaderValue;
                return;
            }
            this._consumeByte(byte);
        }
        _collectHeaderValue(byte) {
            if (byte === CR) {
                // Ignore CR
                return;
            }
            if (byte === LF) {
                this._results.headers.push([this._headerKey, this._consumeTokenAsUTF8()]);
                this._headerKey = undefined;
                this._onByte = this._collectHeaders;
                return;
            }
            this._consumeByte(byte);
        }
        _setupCollectBody() {
            const contentLengthHeader = this._results.headers.filter((header) => {
                return header[0] === 'content-length';
            })[0];
            if (contentLengthHeader) {
                this._bodyBytesRemaining = parseInt(contentLengthHeader[1], 10);
                this._onByte = this._collectBodyFixedSize;
            }
            else {
                this._onByte = this._collectBodyNullTerminated;
            }
        }
        _collectBodyNullTerminated(byte) {
            if (byte === NULL) {
                this._retrievedBody();
                return;
            }
            this._consumeByte(byte);
        }
        _collectBodyFixedSize(byte) {
            // It is post decrement, so that we discard the trailing NULL octet
            if (this._bodyBytesRemaining-- === 0) {
                this._retrievedBody();
                return;
            }
            this._consumeByte(byte);
        }
        _retrievedBody() {
            this._results.binaryBody = this._consumeTokenAsRaw();
            this.onFrame(this._results);
            this._initState();
        }
        // Rec Descent Parser helpers
        _consumeByte(byte) {
            this._token.push(byte);
        }
        _consumeTokenAsUTF8() {
            return this._decoder.decode(this._consumeTokenAsRaw());
        }
        _consumeTokenAsRaw() {
            const rawResult = new Uint8Array(this._token);
            this._token = [];
            return rawResult;
        }
        _initState() {
            this._results = {
                command: undefined,
                headers: [],
                binaryBody: undefined,
            };
            this._token = [];
            this._headerKey = undefined;
            this._onByte = this._collectFrame;
        }
    }

    /**
     * Possible states for the IStompSocket
     */
    var StompSocketState;
    (function (StompSocketState) {
        StompSocketState[StompSocketState["CONNECTING"] = 0] = "CONNECTING";
        StompSocketState[StompSocketState["OPEN"] = 1] = "OPEN";
        StompSocketState[StompSocketState["CLOSING"] = 2] = "CLOSING";
        StompSocketState[StompSocketState["CLOSED"] = 3] = "CLOSED";
    })(StompSocketState || (StompSocketState = {}));
    /**
     * Possible activation state
     */
    var ActivationState;
    (function (ActivationState) {
        ActivationState[ActivationState["ACTIVE"] = 0] = "ACTIVE";
        ActivationState[ActivationState["DEACTIVATING"] = 1] = "DEACTIVATING";
        ActivationState[ActivationState["INACTIVE"] = 2] = "INACTIVE";
    })(ActivationState || (ActivationState = {}));

    /**
     * Supported STOMP versions
     *
     * Part of `@stomp/stompjs`.
     */
    class Versions {
        /**
         * Takes an array of string of versions, typical elements '1.0', '1.1', or '1.2'
         *
         * You will an instance if this class if you want to override supported versions to be declared during
         * STOMP handshake.
         */
        constructor(versions) {
            this.versions = versions;
        }
        /**
         * Used as part of CONNECT STOMP Frame
         */
        supportedVersions() {
            return this.versions.join(',');
        }
        /**
         * Used while creating a WebSocket
         */
        protocolVersions() {
            return this.versions.map(x => `v${x.replace('.', '')}.stomp`);
        }
    }
    /**
     * Indicates protocol version 1.0
     */
    Versions.V1_0 = '1.0';
    /**
     * Indicates protocol version 1.1
     */
    Versions.V1_1 = '1.1';
    /**
     * Indicates protocol version 1.2
     */
    Versions.V1_2 = '1.2';
    /**
     * @internal
     */
    Versions.default = new Versions([
        Versions.V1_0,
        Versions.V1_1,
        Versions.V1_2,
    ]);

    /**
     * @internal
     */
    function augmentWebsocket(webSocket, debug) {
        webSocket.terminate = function () {
            const noOp = () => { };
            // set all callbacks to no op
            this.onerror = noOp;
            this.onmessage = noOp;
            this.onopen = noOp;
            const ts = new Date();
            const origOnClose = this.onclose;
            // Track delay in actual closure of the socket
            this.onclose = closeEvent => {
                const delay = new Date().getTime() - ts.getTime();
                debug(`Discarded socket closed after ${delay}ms, with code/reason: ${closeEvent.code}/${closeEvent.reason}`);
            };
            this.close();
            origOnClose.call(this, {
                code: 4001,
                reason: 'Heartbeat failure, discarding the socket',
                wasClean: false,
            });
        };
    }

    /**
     * The STOMP protocol handler
     *
     * Part of `@stomp/stompjs`.
     *
     * @internal
     */
    class StompHandler {
        constructor(_client, _webSocket, config = {}) {
            this._client = _client;
            this._webSocket = _webSocket;
            this._serverFrameHandlers = {
                // [CONNECTED Frame](http://stomp.github.com/stomp-specification-1.2.html#CONNECTED_Frame)
                CONNECTED: frame => {
                    this.debug(`connected to server ${frame.headers.server}`);
                    this._connected = true;
                    this._connectedVersion = frame.headers.version;
                    // STOMP version 1.2 needs header values to be escaped
                    if (this._connectedVersion === Versions.V1_2) {
                        this._escapeHeaderValues = true;
                    }
                    this._setupHeartbeat(frame.headers);
                    this.onConnect(frame);
                },
                // [MESSAGE Frame](http://stomp.github.com/stomp-specification-1.2.html#MESSAGE)
                MESSAGE: frame => {
                    // the callback is registered when the client calls
                    // `subscribe()`.
                    // If there is no registered subscription for the received message,
                    // the default `onUnhandledMessage` callback is used that the client can set.
                    // This is useful for subscriptions that are automatically created
                    // on the browser side (e.g. [RabbitMQ's temporary
                    // queues](http://www.rabbitmq.com/stomp.html)).
                    const subscription = frame.headers.subscription;
                    const onReceive = this._subscriptions[subscription] || this.onUnhandledMessage;
                    // bless the frame to be a Message
                    const message = frame;
                    const client = this;
                    const messageId = this._connectedVersion === Versions.V1_2
                        ? message.headers.ack
                        : message.headers['message-id'];
                    // add `ack()` and `nack()` methods directly to the returned frame
                    // so that a simple call to `message.ack()` can acknowledge the message.
                    message.ack = (headers = {}) => {
                        return client.ack(messageId, subscription, headers);
                    };
                    message.nack = (headers = {}) => {
                        return client.nack(messageId, subscription, headers);
                    };
                    onReceive(message);
                },
                // [RECEIPT Frame](http://stomp.github.com/stomp-specification-1.2.html#RECEIPT)
                RECEIPT: frame => {
                    const callback = this._receiptWatchers[frame.headers['receipt-id']];
                    if (callback) {
                        callback(frame);
                        // Server will acknowledge only once, remove the callback
                        delete this._receiptWatchers[frame.headers['receipt-id']];
                    }
                    else {
                        this.onUnhandledReceipt(frame);
                    }
                },
                // [ERROR Frame](http://stomp.github.com/stomp-specification-1.2.html#ERROR)
                ERROR: frame => {
                    this.onStompError(frame);
                },
            };
            // used to index subscribers
            this._counter = 0;
            // subscription callbacks indexed by subscriber's ID
            this._subscriptions = {};
            // receipt-watchers indexed by receipts-ids
            this._receiptWatchers = {};
            this._partialData = '';
            this._escapeHeaderValues = false;
            this._lastServerActivityTS = Date.now();
            this.configure(config);
        }
        get connectedVersion() {
            return this._connectedVersion;
        }
        get connected() {
            return this._connected;
        }
        configure(conf) {
            // bulk assign all properties to this
            Object.assign(this, conf);
        }
        start() {
            const parser = new Parser(
            // On Frame
            rawFrame => {
                const frame = FrameImpl.fromRawFrame(rawFrame, this._escapeHeaderValues);
                // if this.logRawCommunication is set, the rawChunk is logged at this._webSocket.onmessage
                if (!this.logRawCommunication) {
                    this.debug(`<<< ${frame}`);
                }
                const serverFrameHandler = this._serverFrameHandlers[frame.command] || this.onUnhandledFrame;
                serverFrameHandler(frame);
            }, 
            // On Incoming Ping
            () => {
                this.debug('<<< PONG');
            });
            this._webSocket.onmessage = (evt) => {
                this.debug('Received data');
                this._lastServerActivityTS = Date.now();
                if (this.logRawCommunication) {
                    const rawChunkAsString = evt.data instanceof ArrayBuffer
                        ? new TextDecoder().decode(evt.data)
                        : evt.data;
                    this.debug(`<<< ${rawChunkAsString}`);
                }
                parser.parseChunk(evt.data, this.appendMissingNULLonIncoming);
            };
            this._onclose = (closeEvent) => {
                this.debug(`Connection closed to ${this._client.brokerURL}`);
                this._cleanUp();
                this.onWebSocketClose(closeEvent);
            };
            this._webSocket.onclose = this._onclose;
            this._webSocket.onerror = (errorEvent) => {
                this.onWebSocketError(errorEvent);
            };
            this._webSocket.onopen = () => {
                // Clone before updating
                const connectHeaders = Object.assign({}, this.connectHeaders);
                this.debug('Web Socket Opened...');
                connectHeaders['accept-version'] = this.stompVersions.supportedVersions();
                connectHeaders['heart-beat'] = [
                    this.heartbeatOutgoing,
                    this.heartbeatIncoming,
                ].join(',');
                this._transmit({ command: 'CONNECT', headers: connectHeaders });
            };
        }
        _setupHeartbeat(headers) {
            if (headers.version !== Versions.V1_1 &&
                headers.version !== Versions.V1_2) {
                return;
            }
            // It is valid for the server to not send this header
            // https://stomp.github.io/stomp-specification-1.2.html#Heart-beating
            if (!headers['heart-beat']) {
                return;
            }
            // heart-beat header received from the server looks like:
            //
            //     heart-beat: sx, sy
            const [serverOutgoing, serverIncoming] = headers['heart-beat']
                .split(',')
                .map((v) => parseInt(v, 10));
            if (this.heartbeatOutgoing !== 0 && serverIncoming !== 0) {
                const ttl = Math.max(this.heartbeatOutgoing, serverIncoming);
                this.debug(`send PING every ${ttl}ms`);
                this._pinger = setInterval(() => {
                    if (this._webSocket.readyState === StompSocketState.OPEN) {
                        this._webSocket.send(BYTE.LF);
                        this.debug('>>> PING');
                    }
                }, ttl);
            }
            if (this.heartbeatIncoming !== 0 && serverOutgoing !== 0) {
                const ttl = Math.max(this.heartbeatIncoming, serverOutgoing);
                this.debug(`check PONG every ${ttl}ms`);
                this._ponger = setInterval(() => {
                    const delta = Date.now() - this._lastServerActivityTS;
                    // We wait twice the TTL to be flexible on window's setInterval calls
                    if (delta > ttl * 2) {
                        this.debug(`did not receive server activity for the last ${delta}ms`);
                        this._closeOrDiscardWebsocket();
                    }
                }, ttl);
            }
        }
        _closeOrDiscardWebsocket() {
            if (this.discardWebsocketOnCommFailure) {
                this.debug('Discarding websocket, the underlying socket may linger for a while');
                this._discardWebsocket();
            }
            else {
                this.debug('Issuing close on the websocket');
                this._closeWebsocket();
            }
        }
        forceDisconnect() {
            if (this._webSocket) {
                if (this._webSocket.readyState === StompSocketState.CONNECTING ||
                    this._webSocket.readyState === StompSocketState.OPEN) {
                    this._closeOrDiscardWebsocket();
                }
            }
        }
        _closeWebsocket() {
            this._webSocket.onmessage = () => { }; // ignore messages
            this._webSocket.close();
        }
        _discardWebsocket() {
            if (!this._webSocket.terminate) {
                augmentWebsocket(this._webSocket, (msg) => this.debug(msg));
            }
            this._webSocket.terminate();
        }
        _transmit(params) {
            const { command, headers, body, binaryBody, skipContentLengthHeader } = params;
            const frame = new FrameImpl({
                command,
                headers,
                body,
                binaryBody,
                escapeHeaderValues: this._escapeHeaderValues,
                skipContentLengthHeader,
            });
            let rawChunk = frame.serialize();
            if (this.logRawCommunication) {
                this.debug(`>>> ${rawChunk}`);
            }
            else {
                this.debug(`>>> ${frame}`);
            }
            if (this.forceBinaryWSFrames && typeof rawChunk === 'string') {
                rawChunk = new TextEncoder().encode(rawChunk);
            }
            if (typeof rawChunk !== 'string' || !this.splitLargeFrames) {
                this._webSocket.send(rawChunk);
            }
            else {
                let out = rawChunk;
                while (out.length > 0) {
                    const chunk = out.substring(0, this.maxWebSocketChunkSize);
                    out = out.substring(this.maxWebSocketChunkSize);
                    this._webSocket.send(chunk);
                    this.debug(`chunk sent = ${chunk.length}, remaining = ${out.length}`);
                }
            }
        }
        dispose() {
            if (this.connected) {
                try {
                    // clone before updating
                    const disconnectHeaders = Object.assign({}, this.disconnectHeaders);
                    if (!disconnectHeaders.receipt) {
                        disconnectHeaders.receipt = `close-${this._counter++}`;
                    }
                    this.watchForReceipt(disconnectHeaders.receipt, frame => {
                        this._closeWebsocket();
                        this._cleanUp();
                        this.onDisconnect(frame);
                    });
                    this._transmit({ command: 'DISCONNECT', headers: disconnectHeaders });
                }
                catch (error) {
                    this.debug(`Ignoring error during disconnect ${error}`);
                }
            }
            else {
                if (this._webSocket.readyState === StompSocketState.CONNECTING ||
                    this._webSocket.readyState === StompSocketState.OPEN) {
                    this._closeWebsocket();
                }
            }
        }
        _cleanUp() {
            this._connected = false;
            if (this._pinger) {
                clearInterval(this._pinger);
            }
            if (this._ponger) {
                clearInterval(this._ponger);
            }
        }
        publish(params) {
            const { destination, headers, body, binaryBody, skipContentLengthHeader } = params;
            const hdrs = Object.assign({ destination }, headers);
            this._transmit({
                command: 'SEND',
                headers: hdrs,
                body,
                binaryBody,
                skipContentLengthHeader,
            });
        }
        watchForReceipt(receiptId, callback) {
            this._receiptWatchers[receiptId] = callback;
        }
        subscribe(destination, callback, headers = {}) {
            headers = Object.assign({}, headers);
            if (!headers.id) {
                headers.id = `sub-${this._counter++}`;
            }
            headers.destination = destination;
            this._subscriptions[headers.id] = callback;
            this._transmit({ command: 'SUBSCRIBE', headers });
            const client = this;
            return {
                id: headers.id,
                unsubscribe(hdrs) {
                    return client.unsubscribe(headers.id, hdrs);
                },
            };
        }
        unsubscribe(id, headers = {}) {
            headers = Object.assign({}, headers);
            delete this._subscriptions[id];
            headers.id = id;
            this._transmit({ command: 'UNSUBSCRIBE', headers });
        }
        begin(transactionId) {
            const txId = transactionId || `tx-${this._counter++}`;
            this._transmit({
                command: 'BEGIN',
                headers: {
                    transaction: txId,
                },
            });
            const client = this;
            return {
                id: txId,
                commit() {
                    client.commit(txId);
                },
                abort() {
                    client.abort(txId);
                },
            };
        }
        commit(transactionId) {
            this._transmit({
                command: 'COMMIT',
                headers: {
                    transaction: transactionId,
                },
            });
        }
        abort(transactionId) {
            this._transmit({
                command: 'ABORT',
                headers: {
                    transaction: transactionId,
                },
            });
        }
        ack(messageId, subscriptionId, headers = {}) {
            headers = Object.assign({}, headers);
            if (this._connectedVersion === Versions.V1_2) {
                headers.id = messageId;
            }
            else {
                headers['message-id'] = messageId;
            }
            headers.subscription = subscriptionId;
            this._transmit({ command: 'ACK', headers });
        }
        nack(messageId, subscriptionId, headers = {}) {
            headers = Object.assign({}, headers);
            if (this._connectedVersion === Versions.V1_2) {
                headers.id = messageId;
            }
            else {
                headers['message-id'] = messageId;
            }
            headers.subscription = subscriptionId;
            return this._transmit({ command: 'NACK', headers });
        }
    }

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * STOMP Client Class.
     *
     * Part of `@stomp/stompjs`.
     */
    class Client {
        /**
         * Create an instance.
         */
        constructor(conf = {}) {
            /**
             * STOMP versions to attempt during STOMP handshake. By default versions `1.0`, `1.1`, and `1.2` are attempted.
             *
             * Example:
             * ```javascript
             *        // Try only versions 1.0 and 1.1
             *        client.stompVersions = new Versions(['1.0', '1.1'])
             * ```
             */
            this.stompVersions = Versions.default;
            /**
             * Will retry if Stomp connection is not established in specified milliseconds.
             * Default 0, which implies wait for ever.
             */
            this.connectionTimeout = 0;
            /**
             *  automatically reconnect with delay in milliseconds, set to 0 to disable.
             */
            this.reconnectDelay = 5000;
            /**
             * Incoming heartbeat interval in milliseconds. Set to 0 to disable.
             */
            this.heartbeatIncoming = 10000;
            /**
             * Outgoing heartbeat interval in milliseconds. Set to 0 to disable.
             */
            this.heartbeatOutgoing = 10000;
            /**
             * This switches on a non standard behavior while sending WebSocket packets.
             * It splits larger (text) packets into chunks of [maxWebSocketChunkSize]{@link Client#maxWebSocketChunkSize}.
             * Only Java Spring brokers seems to use this mode.
             *
             * WebSockets, by itself, split large (text) packets,
             * so it is not needed with a truly compliant STOMP/WebSocket broker.
             * Actually setting it for such broker will cause large messages to fail.
             *
             * `false` by default.
             *
             * Binary frames are never split.
             */
            this.splitLargeFrames = false;
            /**
             * See [splitLargeFrames]{@link Client#splitLargeFrames}.
             * This has no effect if [splitLargeFrames]{@link Client#splitLargeFrames} is `false`.
             */
            this.maxWebSocketChunkSize = 8 * 1024;
            /**
             * Usually the
             * [type of WebSocket frame]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send#Parameters}
             * is automatically decided by type of the payload.
             * Default is `false`, which should work with all compliant brokers.
             *
             * Set this flag to force binary frames.
             */
            this.forceBinaryWSFrames = false;
            /**
             * A bug in ReactNative chops a string on occurrence of a NULL.
             * See issue [https://github.com/stomp-js/stompjs/issues/89]{@link https://github.com/stomp-js/stompjs/issues/89}.
             * This makes incoming WebSocket messages invalid STOMP packets.
             * Setting this flag attempts to reverse the damage by appending a NULL.
             * If the broker splits a large message into multiple WebSocket messages,
             * this flag will cause data loss and abnormal termination of connection.
             *
             * This is not an ideal solution, but a stop gap until the underlying issue is fixed at ReactNative library.
             */
            this.appendMissingNULLonIncoming = false;
            /**
             * Activation state.
             *
             * It will usually be ACTIVE or INACTIVE.
             * When deactivating it may go from ACTIVE to INACTIVE without entering DEACTIVATING.
             */
            this.state = ActivationState.INACTIVE;
            // Dummy callbacks
            const noOp = () => { };
            this.debug = noOp;
            this.beforeConnect = noOp;
            this.onConnect = noOp;
            this.onDisconnect = noOp;
            this.onUnhandledMessage = noOp;
            this.onUnhandledReceipt = noOp;
            this.onUnhandledFrame = noOp;
            this.onStompError = noOp;
            this.onWebSocketClose = noOp;
            this.onWebSocketError = noOp;
            this.logRawCommunication = false;
            this.onChangeState = noOp;
            // These parameters would typically get proper values before connect is called
            this.connectHeaders = {};
            this._disconnectHeaders = {};
            // Apply configuration
            this.configure(conf);
        }
        /**
         * Underlying WebSocket instance, READONLY.
         */
        get webSocket() {
            return this._stompHandler ? this._stompHandler._webSocket : undefined;
        }
        /**
         * Disconnection headers.
         */
        get disconnectHeaders() {
            return this._disconnectHeaders;
        }
        set disconnectHeaders(value) {
            this._disconnectHeaders = value;
            if (this._stompHandler) {
                this._stompHandler.disconnectHeaders = this._disconnectHeaders;
            }
        }
        /**
         * `true` if there is a active connection with STOMP Broker
         */
        get connected() {
            return !!this._stompHandler && this._stompHandler.connected;
        }
        /**
         * version of STOMP protocol negotiated with the server, READONLY
         */
        get connectedVersion() {
            return this._stompHandler ? this._stompHandler.connectedVersion : undefined;
        }
        /**
         * if the client is active (connected or going to reconnect)
         */
        get active() {
            return this.state === ActivationState.ACTIVE;
        }
        _changeState(state) {
            this.state = state;
            this.onChangeState(state);
        }
        /**
         * Update configuration.
         */
        configure(conf) {
            // bulk assign all properties to this
            Object.assign(this, conf);
        }
        /**
         * Initiate the connection with the broker.
         * If the connection breaks, as per [Client#reconnectDelay]{@link Client#reconnectDelay},
         * it will keep trying to reconnect.
         *
         * Call [Client#deactivate]{@link Client#deactivate} to disconnect and stop reconnection attempts.
         */
        activate() {
            if (this.state === ActivationState.DEACTIVATING) {
                this.debug('Still DEACTIVATING, please await call to deactivate before trying to re-activate');
                throw new Error('Still DEACTIVATING, can not activate now');
            }
            if (this.active) {
                this.debug('Already ACTIVE, ignoring request to activate');
                return;
            }
            this._changeState(ActivationState.ACTIVE);
            this._connect();
        }
        _connect() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.connected) {
                    this.debug('STOMP: already connected, nothing to do');
                    return;
                }
                yield this.beforeConnect();
                if (!this.active) {
                    this.debug('Client has been marked inactive, will not attempt to connect');
                    return;
                }
                // setup connection watcher
                if (this.connectionTimeout > 0) {
                    // clear first
                    if (this._connectionWatcher) {
                        clearTimeout(this._connectionWatcher);
                    }
                    this._connectionWatcher = setTimeout(() => {
                        if (this.connected) {
                            return;
                        }
                        // Connection not established, close the underlying socket
                        // a reconnection will be attempted
                        this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`);
                        this.forceDisconnect();
                    }, this.connectionTimeout);
                }
                this.debug('Opening Web Socket...');
                // Get the actual WebSocket (or a similar object)
                const webSocket = this._createWebSocket();
                this._stompHandler = new StompHandler(this, webSocket, {
                    debug: this.debug,
                    stompVersions: this.stompVersions,
                    connectHeaders: this.connectHeaders,
                    disconnectHeaders: this._disconnectHeaders,
                    heartbeatIncoming: this.heartbeatIncoming,
                    heartbeatOutgoing: this.heartbeatOutgoing,
                    splitLargeFrames: this.splitLargeFrames,
                    maxWebSocketChunkSize: this.maxWebSocketChunkSize,
                    forceBinaryWSFrames: this.forceBinaryWSFrames,
                    logRawCommunication: this.logRawCommunication,
                    appendMissingNULLonIncoming: this.appendMissingNULLonIncoming,
                    discardWebsocketOnCommFailure: this.discardWebsocketOnCommFailure,
                    onConnect: frame => {
                        // Successfully connected, stop the connection watcher
                        if (this._connectionWatcher) {
                            clearTimeout(this._connectionWatcher);
                            this._connectionWatcher = undefined;
                        }
                        if (!this.active) {
                            this.debug('STOMP got connected while deactivate was issued, will disconnect now');
                            this._disposeStompHandler();
                            return;
                        }
                        this.onConnect(frame);
                    },
                    onDisconnect: frame => {
                        this.onDisconnect(frame);
                    },
                    onStompError: frame => {
                        this.onStompError(frame);
                    },
                    onWebSocketClose: evt => {
                        this._stompHandler = undefined; // a new one will be created in case of a reconnect
                        if (this.state === ActivationState.DEACTIVATING) {
                            // Mark deactivation complete
                            this._resolveSocketClose();
                            this._resolveSocketClose = undefined;
                            this._changeState(ActivationState.INACTIVE);
                        }
                        this.onWebSocketClose(evt);
                        // The callback is called before attempting to reconnect, this would allow the client
                        // to be `deactivated` in the callback.
                        if (this.active) {
                            this._schedule_reconnect();
                        }
                    },
                    onWebSocketError: evt => {
                        this.onWebSocketError(evt);
                    },
                    onUnhandledMessage: message => {
                        this.onUnhandledMessage(message);
                    },
                    onUnhandledReceipt: frame => {
                        this.onUnhandledReceipt(frame);
                    },
                    onUnhandledFrame: frame => {
                        this.onUnhandledFrame(frame);
                    },
                });
                this._stompHandler.start();
            });
        }
        _createWebSocket() {
            let webSocket;
            if (this.webSocketFactory) {
                webSocket = this.webSocketFactory();
            }
            else {
                webSocket = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
            }
            webSocket.binaryType = 'arraybuffer';
            return webSocket;
        }
        _schedule_reconnect() {
            if (this.reconnectDelay > 0) {
                this.debug(`STOMP: scheduling reconnection in ${this.reconnectDelay}ms`);
                this._reconnector = setTimeout(() => {
                    this._connect();
                }, this.reconnectDelay);
            }
        }
        /**
         * Disconnect if connected and stop auto reconnect loop.
         * Appropriate callbacks will be invoked if underlying STOMP connection was connected.
         *
         * This call is async, it will resolve immediately if there is no underlying active websocket,
         * otherwise, it will resolve after underlying websocket is properly disposed.
         *
         * To reactivate you can call [Client#activate]{@link Client#activate}.
         */
        deactivate() {
            return __awaiter(this, void 0, void 0, function* () {
                let retPromise;
                if (this.state !== ActivationState.ACTIVE) {
                    this.debug(`Already ${ActivationState[this.state]}, ignoring call to deactivate`);
                    return Promise.resolve();
                }
                this._changeState(ActivationState.DEACTIVATING);
                // Clear if a reconnection was scheduled
                if (this._reconnector) {
                    clearTimeout(this._reconnector);
                }
                if (this._stompHandler &&
                    this.webSocket.readyState !== StompSocketState.CLOSED) {
                    // we need to wait for underlying websocket to close
                    retPromise = new Promise((resolve, reject) => {
                        this._resolveSocketClose = resolve;
                    });
                }
                else {
                    // indicate that auto reconnect loop should terminate
                    this._changeState(ActivationState.INACTIVE);
                    return Promise.resolve();
                }
                this._disposeStompHandler();
                return retPromise;
            });
        }
        /**
         * Force disconnect if there is an active connection by directly closing the underlying WebSocket.
         * This is different than a normal disconnect where a DISCONNECT sequence is carried out with the broker.
         * After forcing disconnect, automatic reconnect will be attempted.
         * To stop further reconnects call [Client#deactivate]{@link Client#deactivate} as well.
         */
        forceDisconnect() {
            if (this._stompHandler) {
                this._stompHandler.forceDisconnect();
            }
        }
        _disposeStompHandler() {
            // Dispose STOMP Handler
            if (this._stompHandler) {
                this._stompHandler.dispose();
                this._stompHandler = null;
            }
        }
        /**
         * Send a message to a named destination. Refer to your STOMP broker documentation for types
         * and naming of destinations.
         *
         * STOMP protocol specifies and suggests some headers and also allows broker specific headers.
         *
         * `body` must be String.
         * You will need to covert the payload to string in case it is not string (e.g. JSON).
         *
         * To send a binary message body use binaryBody parameter. It should be a
         * [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
         * Sometimes brokers may not support binary frames out of the box.
         * Please check your broker documentation.
         *
         * `content-length` header is automatically added to the STOMP Frame sent to the broker.
         * Set `skipContentLengthHeader` to indicate that `content-length` header should not be added.
         * For binary messages `content-length` header is always added.
         *
         * Caution: The broker will, most likely, report an error and disconnect if message body has NULL octet(s)
         * and `content-length` header is missing.
         *
         * ```javascript
         *        client.publish({destination: "/queue/test", headers: {priority: 9}, body: "Hello, STOMP"});
         *
         *        // Only destination is mandatory parameter
         *        client.publish({destination: "/queue/test", body: "Hello, STOMP"});
         *
         *        // Skip content-length header in the frame to the broker
         *        client.publish({"/queue/test", body: "Hello, STOMP", skipContentLengthHeader: true});
         *
         *        var binaryData = generateBinaryData(); // This need to be of type Uint8Array
         *        // setting content-type header is not mandatory, however a good practice
         *        client.publish({destination: '/topic/special', binaryBody: binaryData,
         *                         headers: {'content-type': 'application/octet-stream'}});
         * ```
         */
        publish(params) {
            this._stompHandler.publish(params);
        }
        /**
         * STOMP brokers may carry out operation asynchronously and allow requesting for acknowledgement.
         * To request an acknowledgement, a `receipt` header needs to be sent with the actual request.
         * The value (say receipt-id) for this header needs to be unique for each use. Typically a sequence, a UUID, a
         * random number or a combination may be used.
         *
         * A complaint broker will send a RECEIPT frame when an operation has actually been completed.
         * The operation needs to be matched based in the value of the receipt-id.
         *
         * This method allow watching for a receipt and invoke the callback
         * when corresponding receipt has been received.
         *
         * The actual {@link FrameImpl} will be passed as parameter to the callback.
         *
         * Example:
         * ```javascript
         *        // Subscribing with acknowledgement
         *        let receiptId = randomText();
         *
         *        client.watchForReceipt(receiptId, function() {
         *          // Will be called after server acknowledges
         *        });
         *
         *        client.subscribe(TEST.destination, onMessage, {receipt: receiptId});
         *
         *
         *        // Publishing with acknowledgement
         *        receiptId = randomText();
         *
         *        client.watchForReceipt(receiptId, function() {
         *          // Will be called after server acknowledges
         *        });
         *        client.publish({destination: TEST.destination, headers: {receipt: receiptId}, body: msg});
         * ```
         */
        watchForReceipt(receiptId, callback) {
            this._stompHandler.watchForReceipt(receiptId, callback);
        }
        /**
         * Subscribe to a STOMP Broker location. The callback will be invoked for each received message with
         * the {@link IMessage} as argument.
         *
         * Note: The library will generate an unique ID if there is none provided in the headers.
         *       To use your own ID, pass it using the headers argument.
         *
         * ```javascript
         *        callback = function(message) {
         *        // called when the client receives a STOMP message from the server
         *          if (message.body) {
         *            alert("got message with body " + message.body)
         *          } else {
         *            alert("got empty message");
         *          }
         *        });
         *
         *        var subscription = client.subscribe("/queue/test", callback);
         *
         *        // Explicit subscription id
         *        var mySubId = 'my-subscription-id-001';
         *        var subscription = client.subscribe(destination, callback, { id: mySubId });
         * ```
         */
        subscribe(destination, callback, headers = {}) {
            return this._stompHandler.subscribe(destination, callback, headers);
        }
        /**
         * It is preferable to unsubscribe from a subscription by calling
         * `unsubscribe()` directly on {@link StompSubscription} returned by `client.subscribe()`:
         *
         * ```javascript
         *        var subscription = client.subscribe(destination, onmessage);
         *        // ...
         *        subscription.unsubscribe();
         * ```
         *
         * See: http://stomp.github.com/stomp-specification-1.2.html#UNSUBSCRIBE UNSUBSCRIBE Frame
         */
        unsubscribe(id, headers = {}) {
            this._stompHandler.unsubscribe(id, headers);
        }
        /**
         * Start a transaction, the returned {@link ITransaction} has methods - [commit]{@link ITransaction#commit}
         * and [abort]{@link ITransaction#abort}.
         *
         * `transactionId` is optional, if not passed the library will generate it internally.
         */
        begin(transactionId) {
            return this._stompHandler.begin(transactionId);
        }
        /**
         * Commit a transaction.
         *
         * It is preferable to commit a transaction by calling [commit]{@link ITransaction#commit} directly on
         * {@link ITransaction} returned by [client.begin]{@link Client#begin}.
         *
         * ```javascript
         *        var tx = client.begin(txId);
         *        //...
         *        tx.commit();
         * ```
         */
        commit(transactionId) {
            this._stompHandler.commit(transactionId);
        }
        /**
         * Abort a transaction.
         * It is preferable to abort a transaction by calling [abort]{@link ITransaction#abort} directly on
         * {@link ITransaction} returned by [client.begin]{@link Client#begin}.
         *
         * ```javascript
         *        var tx = client.begin(txId);
         *        //...
         *        tx.abort();
         * ```
         */
        abort(transactionId) {
            this._stompHandler.abort(transactionId);
        }
        /**
         * ACK a message. It is preferable to acknowledge a message by calling [ack]{@link IMessage#ack} directly
         * on the {@link IMessage} handled by a subscription callback:
         *
         * ```javascript
         *        var callback = function (message) {
         *          // process the message
         *          // acknowledge it
         *          message.ack();
         *        };
         *        client.subscribe(destination, callback, {'ack': 'client'});
         * ```
         */
        ack(messageId, subscriptionId, headers = {}) {
            this._stompHandler.ack(messageId, subscriptionId, headers);
        }
        /**
         * NACK a message. It is preferable to acknowledge a message by calling [nack]{@link IMessage#nack} directly
         * on the {@link IMessage} handled by a subscription callback:
         *
         * ```javascript
         *        var callback = function (message) {
         *          // process the message
         *          // an error occurs, nack it
         *          message.nack();
         *        };
         *        client.subscribe(destination, callback, {'ack': 'client'});
         * ```
         */
        nack(messageId, subscriptionId, headers = {}) {
            this._stompHandler.nack(messageId, subscriptionId, headers);
        }
    }

    /**
     * Configuration options for STOMP Client, each key corresponds to
     * field by the same name in {@link Client}. This can be passed to
     * the constructor of {@link Client} or to [Client#configure]{@link Client#configure}.
     *
     * There used to be a class with the same name in `@stomp/ng2-stompjs`, which has been replaced by
     * {@link RxStompConfig} and {@link InjectableRxStompConfig}.
     *
     * Part of `@stomp/stompjs`.
     */
    class StompConfig {
    }

    /**
     * STOMP headers. Many functions calls will accept headers as parameters.
     * The headers sent by Broker will be available as [IFrame#headers]{@link IFrame#headers}.
     *
     * `key` and `value` must be valid strings.
     * In addition, `key` must not contain `CR`, `LF`, or `:`.
     *
     * Part of `@stomp/stompjs`.
     */
    class StompHeaders {
    }

    /**
     * Call [Client#subscribe]{@link Client#subscribe} to create a StompSubscription.
     *
     * Part of `@stomp/stompjs`.
     */
    class StompSubscription {
    }

    /**
     * Part of `@stomp/stompjs`.
     *
     * @internal
     */
    class HeartbeatInfo {
        constructor(client) {
            this.client = client;
        }
        get outgoing() {
            return this.client.heartbeatOutgoing;
        }
        set outgoing(value) {
            this.client.heartbeatOutgoing = value;
        }
        get incoming() {
            return this.client.heartbeatIncoming;
        }
        set incoming(value) {
            this.client.heartbeatIncoming = value;
        }
    }

    /**
     * Available for backward compatibility, please shift to using {@link Client}.
     *
     * **Deprecated**
     *
     * Part of `@stomp/stompjs`.
     *
     * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
     */
    class CompatClient extends Client {
        /**
         * Available for backward compatibility, please shift to using {@link Client}
         * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
         *
         * **Deprecated**
         *
         * @internal
         */
        constructor(webSocketFactory) {
            super();
            /**
             * It is no op now. No longer needed. Large packets work out of the box.
             */
            this.maxWebSocketFrameSize = 16 * 1024;
            this._heartbeatInfo = new HeartbeatInfo(this);
            this.reconnect_delay = 0;
            this.webSocketFactory = webSocketFactory;
            // Default from previous version
            this.debug = (...message) => {
                console.log(...message);
            };
        }
        _parseConnect(...args) {
            let closeEventCallback;
            let connectCallback;
            let errorCallback;
            let headers = {};
            if (args.length < 2) {
                throw new Error('Connect requires at least 2 arguments');
            }
            if (typeof args[1] === 'function') {
                [headers, connectCallback, errorCallback, closeEventCallback] = args;
            }
            else {
                switch (args.length) {
                    case 6:
                        [
                            headers.login,
                            headers.passcode,
                            connectCallback,
                            errorCallback,
                            closeEventCallback,
                            headers.host,
                        ] = args;
                        break;
                    default:
                        [
                            headers.login,
                            headers.passcode,
                            connectCallback,
                            errorCallback,
                            closeEventCallback,
                        ] = args;
                }
            }
            return [headers, connectCallback, errorCallback, closeEventCallback];
        }
        /**
         * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
         *
         * **Deprecated**
         *
         * The `connect` method accepts different number of arguments and types. See the Overloads list. Use the
         * version with headers to pass your broker specific options.
         *
         * overloads:
         * - connect(headers, connectCallback)
         * - connect(headers, connectCallback, errorCallback)
         * - connect(login, passcode, connectCallback)
         * - connect(login, passcode, connectCallback, errorCallback)
         * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback)
         * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback, host)
         *
         * params:
         * - headers, see [Client#connectHeaders]{@link Client#connectHeaders}
         * - connectCallback, see [Client#onConnect]{@link Client#onConnect}
         * - errorCallback, see [Client#onStompError]{@link Client#onStompError}
         * - closeEventCallback, see [Client#onWebSocketClose]{@link Client#onWebSocketClose}
         * - login [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
         * - passcode [String], [Client#connectHeaders](../classes/Client.html#connectHeaders)
         * - host [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        connect(...args) {
            const out = this._parseConnect(...args);
            if (out[0]) {
                this.connectHeaders = out[0];
            }
            if (out[1]) {
                this.onConnect = out[1];
            }
            if (out[2]) {
                this.onStompError = out[2];
            }
            if (out[3]) {
                this.onWebSocketClose = out[3];
            }
            super.activate();
        }
        /**
         * Available for backward compatibility, please shift to using [Client#deactivate]{@link Client#deactivate}.
         *
         * **Deprecated**
         *
         * See:
         * [Client#onDisconnect]{@link Client#onDisconnect}, and
         * [Client#disconnectHeaders]{@link Client#disconnectHeaders}
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        disconnect(disconnectCallback, headers = {}) {
            if (disconnectCallback) {
                this.onDisconnect = disconnectCallback;
            }
            this.disconnectHeaders = headers;
            super.deactivate();
        }
        /**
         * Available for backward compatibility, use [Client#publish]{@link Client#publish}.
         *
         * Send a message to a named destination. Refer to your STOMP broker documentation for types
         * and naming of destinations. The headers will, typically, be available to the subscriber.
         * However, there may be special purpose headers corresponding to your STOMP broker.
         *
         *  **Deprecated**, use [Client#publish]{@link Client#publish}
         *
         * Note: Body must be String. You will need to covert the payload to string in case it is not string (e.g. JSON)
         *
         * ```javascript
         *        client.send("/queue/test", {priority: 9}, "Hello, STOMP");
         *
         *        // If you want to send a message with a body, you must also pass the headers argument.
         *        client.send("/queue/test", {}, "Hello, STOMP");
         * ```
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        send(destination, headers = {}, body = '') {
            headers = Object.assign({}, headers);
            const skipContentLengthHeader = headers['content-length'] === false;
            if (skipContentLengthHeader) {
                delete headers['content-length'];
            }
            this.publish({
                destination,
                headers: headers,
                body,
                skipContentLengthHeader,
            });
        }
        /**
         * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
         *
         * **Deprecated**
         */
        set reconnect_delay(value) {
            this.reconnectDelay = value;
        }
        /**
         * Available for backward compatibility, renamed to [Client#webSocket]{@link Client#webSocket}.
         *
         * **Deprecated**
         */
        get ws() {
            return this.webSocket;
        }
        /**
         * Available for backward compatibility, renamed to [Client#connectedVersion]{@link Client#connectedVersion}.
         *
         * **Deprecated**
         */
        get version() {
            return this.connectedVersion;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        get onreceive() {
            return this.onUnhandledMessage;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        set onreceive(value) {
            this.onUnhandledMessage = value;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         * Prefer using [Client#watchForReceipt]{@link Client#watchForReceipt}.
         *
         * **Deprecated**
         */
        get onreceipt() {
            return this.onUnhandledReceipt;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         *
         * **Deprecated**
         */
        set onreceipt(value) {
            this.onUnhandledReceipt = value;
        }
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        get heartbeat() {
            return this._heartbeatInfo;
        }
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        set heartbeat(value) {
            this.heartbeatIncoming = value.incoming;
            this.heartbeatOutgoing = value.outgoing;
        }
    }

    /**
     * STOMP Class, acts like a factory to create {@link Client}.
     *
     * Part of `@stomp/stompjs`.
     *
     * **Deprecated**
     *
     * It will be removed in next major version. Please switch to {@link Client}.
     */
    class Stomp {
        /**
         * This method creates a WebSocket client that is connected to
         * the STOMP server located at the url.
         *
         * ```javascript
         *        var url = "ws://localhost:61614/stomp";
         *        var client = Stomp.client(url);
         * ```
         *
         * **Deprecated**
         *
         * It will be removed in next major version. Please switch to {@link Client}
         * using [Client#brokerURL]{@link Client#brokerURL}.
         */
        static client(url, protocols) {
            // This is a hack to allow another implementation than the standard
            // HTML5 WebSocket class.
            //
            // It is possible to use another class by calling
            //
            //     Stomp.WebSocketClass = MozWebSocket
            //
            // *prior* to call `Stomp.client()`.
            //
            // This hack is deprecated and `Stomp.over()` method should be used
            // instead.
            // See remarks on the function Stomp.over
            if (protocols == null) {
                protocols = Versions.default.protocolVersions();
            }
            const wsFn = () => {
                const klass = Stomp.WebSocketClass || WebSocket;
                return new klass(url, protocols);
            };
            return new CompatClient(wsFn);
        }
        /**
         * This method is an alternative to [Stomp#client]{@link Stomp#client} to let the user
         * specify the WebSocket to use (either a standard HTML5 WebSocket or
         * a similar object).
         *
         * In order to support reconnection, the function Client._connect should be callable more than once.
         * While reconnecting
         * a new instance of underlying transport (TCP Socket, WebSocket or SockJS) will be needed. So, this function
         * alternatively allows passing a function that should return a new instance of the underlying socket.
         *
         * ```javascript
         *        var client = Stomp.over(function(){
         *          return new WebSocket('ws://localhost:15674/ws')
         *        });
         * ```
         *
         * **Deprecated**
         *
         * It will be removed in next major version. Please switch to {@link Client}
         * using [Client#webSocketFactory]{@link Client#webSocketFactory}.
         */
        static over(ws) {
            let wsFn;
            if (typeof ws === 'function') {
                wsFn = ws;
            }
            else {
                console.warn('Stomp.over did not receive a factory, auto reconnect will not work. ' +
                    'Please see https://stomp-js.github.io/api-docs/latest/classes/Stomp.html#over');
                wsFn = () => ws;
            }
            return new CompatClient(wsFn);
        }
    }
    /**
     * In case you need to use a non standard class for WebSocket.
     *
     * For example when using within NodeJS environment:
     *
     * ```javascript
     *        StompJs = require('../../esm5/');
     *        Stomp = StompJs.Stomp;
     *        Stomp.WebSocketClass = require('websocket').w3cwebsocket;
     * ```
     *
     * **Deprecated**
     *
     *
     * It will be removed in next major version. Please switch to {@link Client}
     * using [Client#webSocketFactory]{@link Client#webSocketFactory}.
     */
    // tslint:disable-next-line:variable-name
    Stomp.WebSocketClass = null;

    var StompJs = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Client: Client,
        FrameImpl: FrameImpl,
        Parser: Parser,
        StompConfig: StompConfig,
        StompHeaders: StompHeaders,
        StompSubscription: StompSubscription,
        get StompSocketState () { return StompSocketState; },
        get ActivationState () { return ActivationState; },
        Versions: Versions,
        CompatClient: CompatClient,
        Stomp: Stomp
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var browserCrypto = createCommonjsModule(function (module) {

    if (commonjsGlobal.crypto && commonjsGlobal.crypto.getRandomValues) {
      module.exports.randomBytes = function(length) {
        var bytes = new Uint8Array(length);
        commonjsGlobal.crypto.getRandomValues(bytes);
        return bytes;
      };
    } else {
      module.exports.randomBytes = function(length) {
        var bytes = new Array(length);
        for (var i = 0; i < length; i++) {
          bytes[i] = Math.floor(Math.random() * 256);
        }
        return bytes;
      };
    }
    });

    // This string has length 32, a power of 2, so the modulus doesn't introduce a
    // bias.
    var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
    var random = {
      string: function(length) {
        var max = _randomStringChars.length;
        var bytes = browserCrypto.randomBytes(length);
        var ret = [];
        for (var i = 0; i < length; i++) {
          ret.push(_randomStringChars.substr(bytes[i] % max, 1));
        }
        return ret.join('');
      }

    , number: function(max) {
        return Math.floor(Math.random() * max);
      }

    , numberString: function(max) {
        var t = ('' + (max - 1)).length;
        var p = new Array(t + 1).join('0');
        return (p + this.number(max)).slice(-t);
      }
    };

    var event$1 = createCommonjsModule(function (module) {



    var onUnload = {}
      , afterUnload = false
        // detect google chrome packaged apps because they don't allow the 'unload' event
      , isChromePackagedApp = commonjsGlobal.chrome && commonjsGlobal.chrome.app && commonjsGlobal.chrome.app.runtime
      ;

    module.exports = {
      attachEvent: function(event, listener) {
        if (typeof commonjsGlobal.addEventListener !== 'undefined') {
          commonjsGlobal.addEventListener(event, listener, false);
        } else if (commonjsGlobal.document && commonjsGlobal.attachEvent) {
          // IE quirks.
          // According to: http://stevesouders.com/misc/test-postmessage.php
          // the message gets delivered only to 'document', not 'window'.
          commonjsGlobal.document.attachEvent('on' + event, listener);
          // I get 'window' for ie8.
          commonjsGlobal.attachEvent('on' + event, listener);
        }
      }

    , detachEvent: function(event, listener) {
        if (typeof commonjsGlobal.addEventListener !== 'undefined') {
          commonjsGlobal.removeEventListener(event, listener, false);
        } else if (commonjsGlobal.document && commonjsGlobal.detachEvent) {
          commonjsGlobal.document.detachEvent('on' + event, listener);
          commonjsGlobal.detachEvent('on' + event, listener);
        }
      }

    , unloadAdd: function(listener) {
        if (isChromePackagedApp) {
          return null;
        }

        var ref = random.string(8);
        onUnload[ref] = listener;
        if (afterUnload) {
          setTimeout(this.triggerUnloadCallbacks, 0);
        }
        return ref;
      }

    , unloadDel: function(ref) {
        if (ref in onUnload) {
          delete onUnload[ref];
        }
      }

    , triggerUnloadCallbacks: function() {
        for (var ref in onUnload) {
          onUnload[ref]();
          delete onUnload[ref];
        }
      }
    };

    var unloadTriggered = function() {
      if (afterUnload) {
        return;
      }
      afterUnload = true;
      module.exports.triggerUnloadCallbacks();
    };

    // 'unload' alone is not reliable in opera within an iframe, but we
    // can't use `beforeunload` as IE fires it on javascript: links.
    if (!isChromePackagedApp) {
      module.exports.attachEvent('unload', unloadTriggered);
    }
    });

    /**
     * Check if we're required to add a port number.
     *
     * @see https://url.spec.whatwg.org/#default-port
     * @param {Number|String} port Port number we need to check
     * @param {String} protocol Protocol we need to check against.
     * @returns {Boolean} Is it a default port for the given protocol
     * @api private
     */
    var requiresPort = function required(port, protocol) {
      protocol = protocol.split(':')[0];
      port = +port;

      if (!port) return false;

      switch (protocol) {
        case 'http':
        case 'ws':
        return port !== 80;

        case 'https':
        case 'wss':
        return port !== 443;

        case 'ftp':
        return port !== 21;

        case 'gopher':
        return port !== 70;

        case 'file':
        return false;
      }

      return port !== 0;
    };

    var has = Object.prototype.hasOwnProperty
      , undef;

    /**
     * Decode a URI encoded string.
     *
     * @param {String} input The URI encoded string.
     * @returns {String|Null} The decoded string.
     * @api private
     */
    function decode(input) {
      try {
        return decodeURIComponent(input.replace(/\+/g, ' '));
      } catch (e) {
        return null;
      }
    }

    /**
     * Attempts to encode a given input.
     *
     * @param {String} input The string that needs to be encoded.
     * @returns {String|Null} The encoded string.
     * @api private
     */
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }

    /**
     * Simple query string parser.
     *
     * @param {String} query The query string that needs to be parsed.
     * @returns {Object}
     * @api public
     */
    function querystring(query) {
      var parser = /([^=?#&]+)=?([^&]*)/g
        , result = {}
        , part;

      while (part = parser.exec(query)) {
        var key = decode(part[1])
          , value = decode(part[2]);

        //
        // Prevent overriding of existing properties. This ensures that build-in
        // methods like `toString` or __proto__ are not overriden by malicious
        // querystrings.
        //
        // In the case if failed decoding, we want to omit the key/value pairs
        // from the result.
        //
        if (key === null || value === null || key in result) continue;
        result[key] = value;
      }

      return result;
    }

    /**
     * Transform a query string to an object.
     *
     * @param {Object} obj Object that should be transformed.
     * @param {String} prefix Optional prefix.
     * @returns {String}
     * @api public
     */
    function querystringify(obj, prefix) {
      prefix = prefix || '';

      var pairs = []
        , value
        , key;

      //
      // Optionally prefix with a '?' if needed
      //
      if ('string' !== typeof prefix) prefix = '?';

      for (key in obj) {
        if (has.call(obj, key)) {
          value = obj[key];

          //
          // Edge cases where we actually want to encode the value to an empty
          // string instead of the stringified value.
          //
          if (!value && (value === null || value === undef || isNaN(value))) {
            value = '';
          }

          key = encode(key);
          value = encode(value);

          //
          // If we failed to encode the strings, we should bail out as we don't
          // want to add invalid strings to the query.
          //
          if (key === null || value === null) continue;
          pairs.push(key +'='+ value);
        }
      }

      return pairs.length ? prefix + pairs.join('&') : '';
    }

    //
    // Expose the module.
    //
    var stringify = querystringify;
    var parse = querystring;

    var querystringify_1 = {
    	stringify: stringify,
    	parse: parse
    };

    var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
      , CRHTLF = /[\n\r\t]/g
      , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
      , port = /:\d+$/
      , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
      , windowsDriveLetter = /^[a-zA-Z]:/;

    /**
     * Remove control characters and whitespace from the beginning of a string.
     *
     * @param {Object|String} str String to trim.
     * @returns {String} A new string representing `str` stripped of control
     *     characters and whitespace from its beginning.
     * @public
     */
    function trimLeft(str) {
      return (str ? str : '').toString().replace(controlOrWhitespace, '');
    }

    /**
     * These are the parse rules for the URL parser, it informs the parser
     * about:
     *
     * 0. The char it Needs to parse, if it's a string it should be done using
     *    indexOf, RegExp using exec and NaN means set as current value.
     * 1. The property we should set when parsing this value.
     * 2. Indication if it's backwards or forward parsing, when set as number it's
     *    the value of extra chars that should be split off.
     * 3. Inherit from location if non existing in the parser.
     * 4. `toLowerCase` the resulting value.
     */
    var rules = [
      ['#', 'hash'],                        // Extract from the back.
      ['?', 'query'],                       // Extract from the back.
      function sanitize(address, url) {     // Sanitize what is left of the address
        return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
      },
      ['/', 'pathname'],                    // Extract from the back.
      ['@', 'auth', 1],                     // Extract from the front.
      [NaN, 'host', undefined, 1, 1],       // Set left over value.
      [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
      [NaN, 'hostname', undefined, 1, 1]    // Set left over.
    ];

    /**
     * These properties should not be copied or inherited from. This is only needed
     * for all non blob URL's as a blob URL does not include a hash, only the
     * origin.
     *
     * @type {Object}
     * @private
     */
    var ignore = { hash: 1, query: 1 };

    /**
     * The location object differs when your code is loaded through a normal page,
     * Worker or through a worker using a blob. And with the blobble begins the
     * trouble as the location object will contain the URL of the blob, not the
     * location of the page where our code is loaded in. The actual origin is
     * encoded in the `pathname` so we can thankfully generate a good "default"
     * location from it so we can generate proper relative URL's again.
     *
     * @param {Object|String} loc Optional default location object.
     * @returns {Object} lolcation object.
     * @public
     */
    function lolcation(loc) {
      var globalVar;

      if (typeof window !== 'undefined') globalVar = window;
      else if (typeof commonjsGlobal !== 'undefined') globalVar = commonjsGlobal;
      else if (typeof self !== 'undefined') globalVar = self;
      else globalVar = {};

      var location = globalVar.location || {};
      loc = loc || location;

      var finaldestination = {}
        , type = typeof loc
        , key;

      if ('blob:' === loc.protocol) {
        finaldestination = new Url(unescape(loc.pathname), {});
      } else if ('string' === type) {
        finaldestination = new Url(loc, {});
        for (key in ignore) delete finaldestination[key];
      } else if ('object' === type) {
        for (key in loc) {
          if (key in ignore) continue;
          finaldestination[key] = loc[key];
        }

        if (finaldestination.slashes === undefined) {
          finaldestination.slashes = slashes.test(loc.href);
        }
      }

      return finaldestination;
    }

    /**
     * Check whether a protocol scheme is special.
     *
     * @param {String} The protocol scheme of the URL
     * @return {Boolean} `true` if the protocol scheme is special, else `false`
     * @private
     */
    function isSpecial(scheme) {
      return (
        scheme === 'file:' ||
        scheme === 'ftp:' ||
        scheme === 'http:' ||
        scheme === 'https:' ||
        scheme === 'ws:' ||
        scheme === 'wss:'
      );
    }

    /**
     * @typedef ProtocolExtract
     * @type Object
     * @property {String} protocol Protocol matched in the URL, in lowercase.
     * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
     * @property {String} rest Rest of the URL that is not part of the protocol.
     */

    /**
     * Extract protocol information from a URL with/without double slash ("//").
     *
     * @param {String} address URL we want to extract from.
     * @param {Object} location
     * @return {ProtocolExtract} Extracted information.
     * @private
     */
    function extractProtocol(address, location) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, '');
      location = location || {};

      var match = protocolre.exec(address);
      var protocol = match[1] ? match[1].toLowerCase() : '';
      var forwardSlashes = !!match[2];
      var otherSlashes = !!match[3];
      var slashesCount = 0;
      var rest;

      if (forwardSlashes) {
        if (otherSlashes) {
          rest = match[2] + match[3] + match[4];
          slashesCount = match[2].length + match[3].length;
        } else {
          rest = match[2] + match[4];
          slashesCount = match[2].length;
        }
      } else {
        if (otherSlashes) {
          rest = match[3] + match[4];
          slashesCount = match[3].length;
        } else {
          rest = match[4];
        }
      }

      if (protocol === 'file:') {
        if (slashesCount >= 2) {
          rest = rest.slice(2);
        }
      } else if (isSpecial(protocol)) {
        rest = match[4];
      } else if (protocol) {
        if (forwardSlashes) {
          rest = rest.slice(2);
        }
      } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
      }

      return {
        protocol: protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount: slashesCount,
        rest: rest
      };
    }

    /**
     * Resolve a relative URL pathname against a base URL pathname.
     *
     * @param {String} relative Pathname of the relative URL.
     * @param {String} base Pathname of the base URL.
     * @return {String} Resolved pathname.
     * @private
     */
    function resolve(relative, base) {
      if (relative === '') return base;

      var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
        , i = path.length
        , last = path[i - 1]
        , unshift = false
        , up = 0;

      while (i--) {
        if (path[i] === '.') {
          path.splice(i, 1);
        } else if (path[i] === '..') {
          path.splice(i, 1);
          up++;
        } else if (up) {
          if (i === 0) unshift = true;
          path.splice(i, 1);
          up--;
        }
      }

      if (unshift) path.unshift('');
      if (last === '.' || last === '..') path.push('');

      return path.join('/');
    }

    /**
     * The actual URL instance. Instead of returning an object we've opted-in to
     * create an actual constructor as it's much more memory efficient and
     * faster and it pleases my OCD.
     *
     * It is worth noting that we should not use `URL` as class name to prevent
     * clashes with the global URL instance that got introduced in browsers.
     *
     * @constructor
     * @param {String} address URL we want to parse.
     * @param {Object|String} [location] Location defaults for relative paths.
     * @param {Boolean|Function} [parser] Parser for the query string.
     * @private
     */
    function Url(address, location, parser) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, '');

      if (!(this instanceof Url)) {
        return new Url(address, location, parser);
      }

      var relative, extracted, parse, instruction, index, key
        , instructions = rules.slice()
        , type = typeof location
        , url = this
        , i = 0;

      //
      // The following if statements allows this module two have compatibility with
      // 2 different API:
      //
      // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
      //    where the boolean indicates that the query string should also be parsed.
      //
      // 2. The `URL` interface of the browser which accepts a URL, object as
      //    arguments. The supplied object will be used as default values / fall-back
      //    for relative paths.
      //
      if ('object' !== type && 'string' !== type) {
        parser = location;
        location = null;
      }

      if (parser && 'function' !== typeof parser) parser = querystringify_1.parse;

      location = lolcation(location);

      //
      // Extract protocol information before running the instructions.
      //
      extracted = extractProtocol(address || '', location);
      relative = !extracted.protocol && !extracted.slashes;
      url.slashes = extracted.slashes || relative && location.slashes;
      url.protocol = extracted.protocol || location.protocol || '';
      address = extracted.rest;

      //
      // When the authority component is absent the URL starts with a path
      // component.
      //
      if (
        extracted.protocol === 'file:' && (
          extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
        (!extracted.slashes &&
          (extracted.protocol ||
            extracted.slashesCount < 2 ||
            !isSpecial(url.protocol)))
      ) {
        instructions[3] = [/(.*)/, 'pathname'];
      }

      for (; i < instructions.length; i++) {
        instruction = instructions[i];

        if (typeof instruction === 'function') {
          address = instruction(address, url);
          continue;
        }

        parse = instruction[0];
        key = instruction[1];

        if (parse !== parse) {
          url[key] = address;
        } else if ('string' === typeof parse) {
          index = parse === '@'
            ? address.lastIndexOf(parse)
            : address.indexOf(parse);

          if (~index) {
            if ('number' === typeof instruction[2]) {
              url[key] = address.slice(0, index);
              address = address.slice(index + instruction[2]);
            } else {
              url[key] = address.slice(index);
              address = address.slice(0, index);
            }
          }
        } else if ((index = parse.exec(address))) {
          url[key] = index[1];
          address = address.slice(0, index.index);
        }

        url[key] = url[key] || (
          relative && instruction[3] ? location[key] || '' : ''
        );

        //
        // Hostname, host and protocol should be lowercased so they can be used to
        // create a proper `origin`.
        //
        if (instruction[4]) url[key] = url[key].toLowerCase();
      }

      //
      // Also parse the supplied query string in to an object. If we're supplied
      // with a custom parser as function use that instead of the default build-in
      // parser.
      //
      if (parser) url.query = parser(url.query);

      //
      // If the URL is relative, resolve the pathname against the base URL.
      //
      if (
          relative
        && location.slashes
        && url.pathname.charAt(0) !== '/'
        && (url.pathname !== '' || location.pathname !== '')
      ) {
        url.pathname = resolve(url.pathname, location.pathname);
      }

      //
      // Default to a / for pathname if none exists. This normalizes the URL
      // to always have a /
      //
      if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
        url.pathname = '/' + url.pathname;
      }

      //
      // We should not add port numbers if they are already the default port number
      // for a given protocol. As the host also contains the port number we're going
      // override it with the hostname which contains no port number.
      //
      if (!requiresPort(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = '';
      }

      //
      // Parse down the `auth` for the username and password.
      //
      url.username = url.password = '';

      if (url.auth) {
        index = url.auth.indexOf(':');

        if (~index) {
          url.username = url.auth.slice(0, index);
          url.username = encodeURIComponent(decodeURIComponent(url.username));

          url.password = url.auth.slice(index + 1);
          url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
          url.username = encodeURIComponent(decodeURIComponent(url.auth));
        }

        url.auth = url.password ? url.username +':'+ url.password : url.username;
      }

      url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
        ? url.protocol +'//'+ url.host
        : 'null';

      //
      // The href is just the compiled result.
      //
      url.href = url.toString();
    }

    /**
     * This is convenience method for changing properties in the URL instance to
     * insure that they all propagate correctly.
     *
     * @param {String} part          Property we need to adjust.
     * @param {Mixed} value          The newly assigned value.
     * @param {Boolean|Function} fn  When setting the query, it will be the function
     *                               used to parse the query.
     *                               When setting the protocol, double slash will be
     *                               removed from the final url if it is true.
     * @returns {URL} URL instance for chaining.
     * @public
     */
    function set(part, value, fn) {
      var url = this;

      switch (part) {
        case 'query':
          if ('string' === typeof value && value.length) {
            value = (fn || querystringify_1.parse)(value);
          }

          url[part] = value;
          break;

        case 'port':
          url[part] = value;

          if (!requiresPort(value, url.protocol)) {
            url.host = url.hostname;
            url[part] = '';
          } else if (value) {
            url.host = url.hostname +':'+ value;
          }

          break;

        case 'hostname':
          url[part] = value;

          if (url.port) value += ':'+ url.port;
          url.host = value;
          break;

        case 'host':
          url[part] = value;

          if (port.test(value)) {
            value = value.split(':');
            url.port = value.pop();
            url.hostname = value.join(':');
          } else {
            url.hostname = value;
            url.port = '';
          }

          break;

        case 'protocol':
          url.protocol = value.toLowerCase();
          url.slashes = !fn;
          break;

        case 'pathname':
        case 'hash':
          if (value) {
            var char = part === 'pathname' ? '/' : '#';
            url[part] = value.charAt(0) !== char ? char + value : value;
          } else {
            url[part] = value;
          }
          break;

        case 'username':
        case 'password':
          url[part] = encodeURIComponent(value);
          break;

        case 'auth':
          var index = value.indexOf(':');

          if (~index) {
            url.username = value.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));

            url.password = value.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(value));
          }
      }

      for (var i = 0; i < rules.length; i++) {
        var ins = rules[i];

        if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
      }

      url.auth = url.password ? url.username +':'+ url.password : url.username;

      url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
        ? url.protocol +'//'+ url.host
        : 'null';

      url.href = url.toString();

      return url;
    }

    /**
     * Transform the properties back in to a valid and full URL string.
     *
     * @param {Function} stringify Optional query stringify function.
     * @returns {String} Compiled version of the URL.
     * @public
     */
    function toString(stringify) {
      if (!stringify || 'function' !== typeof stringify) stringify = querystringify_1.stringify;

      var query
        , url = this
        , host = url.host
        , protocol = url.protocol;

      if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

      var result =
        protocol +
        ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

      if (url.username) {
        result += url.username;
        if (url.password) result += ':'+ url.password;
        result += '@';
      } else if (url.password) {
        result += ':'+ url.password;
        result += '@';
      } else if (
        url.protocol !== 'file:' &&
        isSpecial(url.protocol) &&
        !host &&
        url.pathname !== '/'
      ) {
        //
        // Add back the empty userinfo, otherwise the original invalid URL
        // might be transformed into a valid one with `url.pathname` as host.
        //
        result += '@';
      }

      //
      // Trailing colon is removed from `url.host` when it is parsed. If it still
      // ends with a colon, then add back the trailing colon that was removed. This
      // prevents an invalid URL from being transformed into a valid one.
      //
      if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
        host += ':';
      }

      result += host + url.pathname;

      query = 'object' === typeof url.query ? stringify(url.query) : url.query;
      if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

      if (url.hash) result += url.hash;

      return result;
    }

    Url.prototype = { set: set, toString: toString };

    //
    // Expose the URL parser and some additional properties that might be useful for
    // others or testing.
    //
    Url.extractProtocol = extractProtocol;
    Url.location = lolcation;
    Url.trimLeft = trimLeft;
    Url.qs = querystringify_1;

    var urlParse = Url;

    var url = {
      getOrigin: function(url) {
        if (!url) {
          return null;
        }

        var p = new urlParse(url);
        if (p.protocol === 'file:') {
          return null;
        }

        var port = p.port;
        if (!port) {
          port = (p.protocol === 'https:') ? '443' : '80';
        }

        return p.protocol + '//' + p.hostname + ':' + port;
      }

    , isOriginEqual: function(a, b) {
        var res = this.getOrigin(a) === this.getOrigin(b);
        return res;
      }

    , isSchemeEqual: function(a, b) {
        return (a.split(':')[0] === b.split(':')[0]);
      }

    , addPath: function (url, path) {
        var qs = url.split('?');
        return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
      }

    , addQuery: function (url, q) {
        return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
      }

    , isLoopbackAddr: function (addr) {
        return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
      }
    };

    var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
    });

    /* Simplified implementation of DOM2 EventTarget.
     *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
     */

    function EventTarget() {
      this._listeners = {};
    }

    EventTarget.prototype.addEventListener = function(eventType, listener) {
      if (!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
      }
      var arr = this._listeners[eventType];
      // #4
      if (arr.indexOf(listener) === -1) {
        // Make a copy so as not to interfere with a current dispatchEvent.
        arr = arr.concat([listener]);
      }
      this._listeners[eventType] = arr;
    };

    EventTarget.prototype.removeEventListener = function(eventType, listener) {
      var arr = this._listeners[eventType];
      if (!arr) {
        return;
      }
      var idx = arr.indexOf(listener);
      if (idx !== -1) {
        if (arr.length > 1) {
          // Make a copy so as not to interfere with a current dispatchEvent.
          this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
        } else {
          delete this._listeners[eventType];
        }
        return;
      }
    };

    EventTarget.prototype.dispatchEvent = function() {
      var event = arguments[0];
      var t = event.type;
      // equivalent of Array.prototype.slice.call(arguments, 0);
      var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
      // TODO: This doesn't match the real behavior; per spec, onfoo get
      // their place in line from the /first/ time they're set from
      // non-null. Although WebKit bumps it to the end every time it's
      // set.
      if (this['on' + t]) {
        this['on' + t].apply(this, args);
      }
      if (t in this._listeners) {
        // Grab a reference to the listeners list. removeEventListener may alter the list.
        var listeners = this._listeners[t];
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      }
    };

    var eventtarget = EventTarget;

    function EventEmitter$f() {
      eventtarget.call(this);
    }

    inherits_browser(EventEmitter$f, eventtarget);

    EventEmitter$f.prototype.removeAllListeners = function(type) {
      if (type) {
        delete this._listeners[type];
      } else {
        this._listeners = {};
      }
    };

    EventEmitter$f.prototype.once = function(type, listener) {
      var self = this
        , fired = false;

      function g() {
        self.removeListener(type, g);

        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }

      this.on(type, g);
    };

    EventEmitter$f.prototype.emit = function() {
      var type = arguments[0];
      var listeners = this._listeners[type];
      if (!listeners) {
        return;
      }
      // equivalent of Array.prototype.slice.call(arguments, 1);
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var ai = 1; ai < l; ai++) {
        args[ai - 1] = arguments[ai];
      }
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, args);
      }
    };

    EventEmitter$f.prototype.on = EventEmitter$f.prototype.addListener = eventtarget.prototype.addEventListener;
    EventEmitter$f.prototype.removeListener = eventtarget.prototype.removeEventListener;

    var EventEmitter_1 = EventEmitter$f;

    var emitter = {
    	EventEmitter: EventEmitter_1
    };

    var websocket$1 = createCommonjsModule(function (module) {

    var Driver = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
    if (Driver) {
    	module.exports = function WebSocketBrowserDriver(url) {
    		return new Driver(url);
    	};
    } else {
    	module.exports = undefined;
    }
    });

    var EventEmitter$e = emitter.EventEmitter
      ;

    var debug$c = function() {};

    function WebSocketTransport(transUrl, ignore, options) {
      if (!WebSocketTransport.enabled()) {
        throw new Error('Transport created when disabled');
      }

      EventEmitter$e.call(this);

      var self = this;
      var url$1 = url.addPath(transUrl, '/websocket');
      if (url$1.slice(0, 5) === 'https') {
        url$1 = 'wss' + url$1.slice(5);
      } else {
        url$1 = 'ws' + url$1.slice(4);
      }
      this.url = url$1;

      this.ws = new websocket$1(this.url, [], options);
      this.ws.onmessage = function(e) {
        debug$c('message event', e.data);
        self.emit('message', e.data);
      };
      // Firefox has an interesting bug. If a websocket connection is
      // created after onunload, it stays alive even when user
      // navigates away from the page. In such situation let's lie -
      // let's not open the ws connection at all. See:
      // https://github.com/sockjs/sockjs-client/issues/28
      // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
      this.unloadRef = event$1.unloadAdd(function() {
        self.ws.close();
      });
      this.ws.onclose = function(e) {
        debug$c('close event', e.code, e.reason);
        self.emit('close', e.code, e.reason);
        self._cleanup();
      };
      this.ws.onerror = function(e) {
        self.emit('close', 1006, 'WebSocket connection broken');
        self._cleanup();
      };
    }

    inherits_browser(WebSocketTransport, EventEmitter$e);

    WebSocketTransport.prototype.send = function(data) {
      var msg = '[' + data + ']';
      this.ws.send(msg);
    };

    WebSocketTransport.prototype.close = function() {
      var ws = this.ws;
      this._cleanup();
      if (ws) {
        ws.close();
      }
    };

    WebSocketTransport.prototype._cleanup = function() {
      var ws = this.ws;
      if (ws) {
        ws.onmessage = ws.onclose = ws.onerror = null;
      }
      event$1.unloadDel(this.unloadRef);
      this.unloadRef = this.ws = null;
      this.removeAllListeners();
    };

    WebSocketTransport.enabled = function() {
      return !!websocket$1;
    };
    WebSocketTransport.transportName = 'websocket';

    // In theory, ws should require 1 round trip. But in chrome, this is
    // not very stable over SSL. Most likely a ws connection requires a
    // separate SSL connection, in which case 2 round trips are an
    // absolute minumum.
    WebSocketTransport.roundTrips = 2;

    var websocket = WebSocketTransport;

    var EventEmitter$d = emitter.EventEmitter
      ;

    var debug$b = function() {};

    function BufferedSender(url, sender) {
      EventEmitter$d.call(this);
      this.sendBuffer = [];
      this.sender = sender;
      this.url = url;
    }

    inherits_browser(BufferedSender, EventEmitter$d);

    BufferedSender.prototype.send = function(message) {
      this.sendBuffer.push(message);
      if (!this.sendStop) {
        this.sendSchedule();
      }
    };

    // For polling transports in a situation when in the message callback,
    // new message is being send. If the sending connection was started
    // before receiving one, it is possible to saturate the network and
    // timeout due to the lack of receiving socket. To avoid that we delay
    // sending messages by some small time, in order to let receiving
    // connection be started beforehand. This is only a halfmeasure and
    // does not fix the big problem, but it does make the tests go more
    // stable on slow networks.
    BufferedSender.prototype.sendScheduleWait = function() {
      var self = this;
      var tref;
      this.sendStop = function() {
        self.sendStop = null;
        clearTimeout(tref);
      };
      tref = setTimeout(function() {
        self.sendStop = null;
        self.sendSchedule();
      }, 25);
    };

    BufferedSender.prototype.sendSchedule = function() {
      debug$b('sendSchedule', this.sendBuffer.length);
      var self = this;
      if (this.sendBuffer.length > 0) {
        var payload = '[' + this.sendBuffer.join(',') + ']';
        this.sendStop = this.sender(this.url, payload, function(err) {
          self.sendStop = null;
          if (err) {
            self.emit('close', err.code || 1006, 'Sending error: ' + err);
            self.close();
          } else {
            self.sendScheduleWait();
          }
        });
        this.sendBuffer = [];
      }
    };

    BufferedSender.prototype._cleanup = function() {
      this.removeAllListeners();
    };

    BufferedSender.prototype.close = function() {
      this._cleanup();
      if (this.sendStop) {
        this.sendStop();
        this.sendStop = null;
      }
    };

    var bufferedSender = BufferedSender;

    var EventEmitter$c = emitter.EventEmitter
      ;

    var debug$a = function() {};

    function Polling(Receiver, receiveUrl, AjaxObject) {
      EventEmitter$c.call(this);
      this.Receiver = Receiver;
      this.receiveUrl = receiveUrl;
      this.AjaxObject = AjaxObject;
      this._scheduleReceiver();
    }

    inherits_browser(Polling, EventEmitter$c);

    Polling.prototype._scheduleReceiver = function() {
      var self = this;
      var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

      poll.on('message', function(msg) {
        self.emit('message', msg);
      });

      poll.once('close', function(code, reason) {
        debug$a('close', code, reason, self.pollIsClosing);
        self.poll = poll = null;

        if (!self.pollIsClosing) {
          if (reason === 'network') {
            self._scheduleReceiver();
          } else {
            self.emit('close', code || 1006, reason);
            self.removeAllListeners();
          }
        }
      });
    };

    Polling.prototype.abort = function() {
      this.removeAllListeners();
      this.pollIsClosing = true;
      if (this.poll) {
        this.poll.abort();
      }
    };

    var polling = Polling;

    function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
      var pollUrl = url.addPath(transUrl, urlSuffix);
      var self = this;
      bufferedSender.call(this, transUrl, senderFunc);

      this.poll = new polling(Receiver, pollUrl, AjaxObject);
      this.poll.on('message', function(msg) {
        self.emit('message', msg);
      });
      this.poll.once('close', function(code, reason) {
        self.poll = null;
        self.emit('close', code, reason);
        self.close();
      });
    }

    inherits_browser(SenderReceiver, bufferedSender);

    SenderReceiver.prototype.close = function() {
      bufferedSender.prototype.close.call(this);
      this.removeAllListeners();
      if (this.poll) {
        this.poll.abort();
        this.poll = null;
      }
    };

    var senderReceiver = SenderReceiver;

    function createAjaxSender(AjaxObject) {
      return function(url$1, payload, callback) {
        var opt = {};
        if (typeof payload === 'string') {
          opt.headers = {'Content-type': 'text/plain'};
        }
        var ajaxUrl = url.addPath(url$1, '/xhr_send');
        var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
        xo.once('finish', function(status) {
          xo = null;

          if (status !== 200 && status !== 204) {
            return callback(new Error('http status ' + status));
          }
          callback();
        });
        return function() {
          xo.close();
          xo = null;

          var err = new Error('Aborted');
          err.code = 1000;
          callback(err);
        };
      };
    }

    function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
      senderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
    }

    inherits_browser(AjaxBasedTransport, senderReceiver);

    var ajaxBased = AjaxBasedTransport;

    var EventEmitter$b = emitter.EventEmitter
      ;

    function XhrReceiver(url, AjaxObject) {
      EventEmitter$b.call(this);
      var self = this;

      this.bufferPosition = 0;

      this.xo = new AjaxObject('POST', url, null);
      this.xo.on('chunk', this._chunkHandler.bind(this));
      this.xo.once('finish', function(status, text) {
        self._chunkHandler(status, text);
        self.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        self.emit('close', null, reason);
        self._cleanup();
      });
    }

    inherits_browser(XhrReceiver, EventEmitter$b);

    XhrReceiver.prototype._chunkHandler = function(status, text) {
      if (status !== 200 || !text) {
        return;
      }

      for (var idx = -1; ; this.bufferPosition += idx + 1) {
        var buf = text.slice(this.bufferPosition);
        idx = buf.indexOf('\n');
        if (idx === -1) {
          break;
        }
        var msg = buf.slice(0, idx);
        if (msg) {
          this.emit('message', msg);
        }
      }
    };

    XhrReceiver.prototype._cleanup = function() {
      this.removeAllListeners();
    };

    XhrReceiver.prototype.abort = function() {
      if (this.xo) {
        this.xo.close();
        this.emit('close', null, 'user');
        this.xo = null;
      }
      this._cleanup();
    };

    var xhr = XhrReceiver;

    var EventEmitter$a = emitter.EventEmitter
      , XHR = commonjsGlobal.XMLHttpRequest
      ;

    var debug$9 = function() {};

    function AbstractXHRObject(method, url, payload, opts) {
      var self = this;
      EventEmitter$a.call(this);

      setTimeout(function () {
        self._start(method, url, payload, opts);
      }, 0);
    }

    inherits_browser(AbstractXHRObject, EventEmitter$a);

    AbstractXHRObject.prototype._start = function(method, url$1, payload, opts) {
      var self = this;

      try {
        this.xhr = new XHR();
      } catch (x) {
        // intentionally empty
      }

      if (!this.xhr) {
        this.emit('finish', 0, 'no xhr support');
        this._cleanup();
        return;
      }

      // several browsers cache POSTs
      url$1 = url.addQuery(url$1, 't=' + (+new Date()));

      // Explorer tends to keep connection open, even after the
      // tab gets closed: http://bugs.jquery.com/ticket/5280
      this.unloadRef = event$1.unloadAdd(function() {
        self._cleanup(true);
      });
      try {
        this.xhr.open(method, url$1, true);
        if (this.timeout && 'timeout' in this.xhr) {
          this.xhr.timeout = this.timeout;
          this.xhr.ontimeout = function() {
            debug$9('xhr timeout');
            self.emit('finish', 0, '');
            self._cleanup(false);
          };
        }
      } catch (e) {
        // IE raises an exception on wrong port.
        this.emit('finish', 0, '');
        this._cleanup(false);
        return;
      }

      if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."

        this.xhr.withCredentials = true;
      }
      if (opts && opts.headers) {
        for (var key in opts.headers) {
          this.xhr.setRequestHeader(key, opts.headers[key]);
        }
      }

      this.xhr.onreadystatechange = function() {
        if (self.xhr) {
          var x = self.xhr;
          var text, status;
          debug$9('readyState', x.readyState);
          switch (x.readyState) {
          case 3:
            // IE doesn't like peeking into responseText or status
            // on Microsoft.XMLHTTP and readystate=3
            try {
              status = x.status;
              text = x.responseText;
            } catch (e) {
              // intentionally empty
            }
            // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
            if (status === 1223) {
              status = 204;
            }

            // IE does return readystate == 3 for 404 answers.
            if (status === 200 && text && text.length > 0) {
              self.emit('chunk', status, text);
            }
            break;
          case 4:
            status = x.status;
            // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
            if (status === 1223) {
              status = 204;
            }
            // IE returns this for a bad port
            // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
            if (status === 12005 || status === 12029) {
              status = 0;
            }

            debug$9('finish', status, x.responseText);
            self.emit('finish', status, x.responseText);
            self._cleanup(false);
            break;
          }
        }
      };

      try {
        self.xhr.send(payload);
      } catch (e) {
        self.emit('finish', 0, '');
        self._cleanup(false);
      }
    };

    AbstractXHRObject.prototype._cleanup = function(abort) {
      if (!this.xhr) {
        return;
      }
      this.removeAllListeners();
      event$1.unloadDel(this.unloadRef);

      // IE needs this field to be a function
      this.xhr.onreadystatechange = function() {};
      if (this.xhr.ontimeout) {
        this.xhr.ontimeout = null;
      }

      if (abort) {
        try {
          this.xhr.abort();
        } catch (x) {
          // intentionally empty
        }
      }
      this.unloadRef = this.xhr = null;
    };

    AbstractXHRObject.prototype.close = function() {
      this._cleanup(true);
    };

    AbstractXHRObject.enabled = !!XHR;
    // override XMLHttpRequest for IE6/7
    // obfuscate to avoid firewalls
    var axo$1 = ['Active'].concat('Object').join('X');
    if (!AbstractXHRObject.enabled && (axo$1 in commonjsGlobal)) {
      XHR = function() {
        try {
          return new commonjsGlobal[axo$1]('Microsoft.XMLHTTP');
        } catch (e) {
          return null;
        }
      };
      AbstractXHRObject.enabled = !!new XHR();
    }

    var cors = false;
    try {
      cors = 'withCredentials' in new XHR();
    } catch (ignored) {
      // intentionally empty
    }

    AbstractXHRObject.supportsCORS = cors;

    var abstractXhr = AbstractXHRObject;

    function XHRCorsObject(method, url, payload, opts) {
      abstractXhr.call(this, method, url, payload, opts);
    }

    inherits_browser(XHRCorsObject, abstractXhr);

    XHRCorsObject.enabled = abstractXhr.enabled && abstractXhr.supportsCORS;

    var xhrCors = XHRCorsObject;

    function XHRLocalObject(method, url, payload /*, opts */) {
      abstractXhr.call(this, method, url, payload, {
        noCredentials: true
      });
    }

    inherits_browser(XHRLocalObject, abstractXhr);

    XHRLocalObject.enabled = abstractXhr.enabled;

    var xhrLocal = XHRLocalObject;

    var browser = {
      isOpera: function() {
        return commonjsGlobal.navigator &&
          /opera/i.test(commonjsGlobal.navigator.userAgent);
      }

    , isKonqueror: function() {
        return commonjsGlobal.navigator &&
          /konqueror/i.test(commonjsGlobal.navigator.userAgent);
      }

      // #187 wrap document.domain in try/catch because of WP8 from file:///
    , hasDomain: function () {
        // non-browser client always has a domain
        if (!commonjsGlobal.document) {
          return true;
        }

        try {
          return !!commonjsGlobal.document.domain;
        } catch (e) {
          return false;
        }
      }
    };

    function XhrStreamingTransport(transUrl) {
      if (!xhrLocal.enabled && !xhrCors.enabled) {
        throw new Error('Transport created when disabled');
      }
      ajaxBased.call(this, transUrl, '/xhr_streaming', xhr, xhrCors);
    }

    inherits_browser(XhrStreamingTransport, ajaxBased);

    XhrStreamingTransport.enabled = function(info) {
      if (info.nullOrigin) {
        return false;
      }
      // Opera doesn't support xhr-streaming #60
      // But it might be able to #92
      if (browser.isOpera()) {
        return false;
      }

      return xhrCors.enabled;
    };

    XhrStreamingTransport.transportName = 'xhr-streaming';
    XhrStreamingTransport.roundTrips = 2; // preflight, ajax

    // Safari gets confused when a streaming ajax request is started
    // before onload. This causes the load indicator to spin indefinetely.
    // Only require body when used in a browser
    XhrStreamingTransport.needBody = !!commonjsGlobal.document;

    var xhrStreaming = XhrStreamingTransport;

    var EventEmitter$9 = emitter.EventEmitter
      ;

    var debug$8 = function() {};

    // References:
    //   http://ajaxian.com/archives/100-line-ajax-wrapper
    //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

    function XDRObject(method, url, payload) {
      var self = this;
      EventEmitter$9.call(this);

      setTimeout(function() {
        self._start(method, url, payload);
      }, 0);
    }

    inherits_browser(XDRObject, EventEmitter$9);

    XDRObject.prototype._start = function(method, url$1, payload) {
      var self = this;
      var xdr = new commonjsGlobal.XDomainRequest();
      // IE caches even POSTs
      url$1 = url.addQuery(url$1, 't=' + (+new Date()));

      xdr.onerror = function() {
        self._error();
      };
      xdr.ontimeout = function() {
        self._error();
      };
      xdr.onprogress = function() {
        debug$8('progress', xdr.responseText);
        self.emit('chunk', 200, xdr.responseText);
      };
      xdr.onload = function() {
        self.emit('finish', 200, xdr.responseText);
        self._cleanup(false);
      };
      this.xdr = xdr;
      this.unloadRef = event$1.unloadAdd(function() {
        self._cleanup(true);
      });
      try {
        // Fails with AccessDenied if port number is bogus
        this.xdr.open(method, url$1);
        if (this.timeout) {
          this.xdr.timeout = this.timeout;
        }
        this.xdr.send(payload);
      } catch (x) {
        this._error();
      }
    };

    XDRObject.prototype._error = function() {
      this.emit('finish', 0, '');
      this._cleanup(false);
    };

    XDRObject.prototype._cleanup = function(abort) {
      if (!this.xdr) {
        return;
      }
      this.removeAllListeners();
      event$1.unloadDel(this.unloadRef);

      this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
      if (abort) {
        try {
          this.xdr.abort();
        } catch (x) {
          // intentionally empty
        }
      }
      this.unloadRef = this.xdr = null;
    };

    XDRObject.prototype.close = function() {
      this._cleanup(true);
    };

    // IE 8/9 if the request target uses the same scheme - #79
    XDRObject.enabled = !!(commonjsGlobal.XDomainRequest && browser.hasDomain());

    var xdr = XDRObject;

    // According to:
    //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
    //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

    function XdrStreamingTransport(transUrl) {
      if (!xdr.enabled) {
        throw new Error('Transport created when disabled');
      }
      ajaxBased.call(this, transUrl, '/xhr_streaming', xhr, xdr);
    }

    inherits_browser(XdrStreamingTransport, ajaxBased);

    XdrStreamingTransport.enabled = function(info) {
      if (info.cookie_needed || info.nullOrigin) {
        return false;
      }
      return xdr.enabled && info.sameScheme;
    };

    XdrStreamingTransport.transportName = 'xdr-streaming';
    XdrStreamingTransport.roundTrips = 2; // preflight, ajax

    var xdrStreaming = XdrStreamingTransport;

    var eventsource$2 = commonjsGlobal.EventSource;

    var EventEmitter$8 = emitter.EventEmitter
      ;

    var debug$7 = function() {};

    function EventSourceReceiver(url) {
      EventEmitter$8.call(this);

      var self = this;
      var es = this.es = new eventsource$2(url);
      es.onmessage = function(e) {
        debug$7('message', e.data);
        self.emit('message', decodeURI(e.data));
      };
      es.onerror = function(e) {
        debug$7('error', es.readyState);
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = (es.readyState !== 2 ? 'network' : 'permanent');
        self._cleanup();
        self._close(reason);
      };
    }

    inherits_browser(EventSourceReceiver, EventEmitter$8);

    EventSourceReceiver.prototype.abort = function() {
      this._cleanup();
      this._close('user');
    };

    EventSourceReceiver.prototype._cleanup = function() {
      var es = this.es;
      if (es) {
        es.onmessage = es.onerror = null;
        es.close();
        this.es = null;
      }
    };

    EventSourceReceiver.prototype._close = function(reason) {
      var self = this;
      // Safari and chrome < 15 crash if we close window before
      // waiting for ES cleanup. See:
      // https://code.google.com/p/chromium/issues/detail?id=89155
      setTimeout(function() {
        self.emit('close', null, reason);
        self.removeAllListeners();
      }, 200);
    };

    var eventsource$1 = EventSourceReceiver;

    function EventSourceTransport(transUrl) {
      if (!EventSourceTransport.enabled()) {
        throw new Error('Transport created when disabled');
      }

      ajaxBased.call(this, transUrl, '/eventsource', eventsource$1, xhrCors);
    }

    inherits_browser(EventSourceTransport, ajaxBased);

    EventSourceTransport.enabled = function() {
      return !!eventsource$2;
    };

    EventSourceTransport.transportName = 'eventsource';
    EventSourceTransport.roundTrips = 2;

    var eventsource = EventSourceTransport;

    var version = '1.6.1';

    var iframe$1 = createCommonjsModule(function (module) {

    module.exports = {
      WPrefix: '_jp'
    , currentWindowId: null

    , polluteGlobalNamespace: function() {
        if (!(module.exports.WPrefix in commonjsGlobal)) {
          commonjsGlobal[module.exports.WPrefix] = {};
        }
      }

    , postMessage: function(type, data) {
        if (commonjsGlobal.parent !== commonjsGlobal) {
          commonjsGlobal.parent.postMessage(JSON.stringify({
            windowId: module.exports.currentWindowId
          , type: type
          , data: data || ''
          }), '*');
        }
      }

    , createIframe: function(iframeUrl, errorCallback) {
        var iframe = commonjsGlobal.document.createElement('iframe');
        var tref, unloadRef;
        var unattach = function() {
          clearTimeout(tref);
          // Explorer had problems with that.
          try {
            iframe.onload = null;
          } catch (x) {
            // intentionally empty
          }
          iframe.onerror = null;
        };
        var cleanup = function() {
          if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
              if (iframe) {
                iframe.parentNode.removeChild(iframe);
              }
              iframe = null;
            }, 0);
            event$1.unloadDel(unloadRef);
          }
        };
        var onerror = function(err) {
          if (iframe) {
            cleanup();
            errorCallback(err);
          }
        };
        var post = function(msg, origin) {
          setTimeout(function() {
            try {
              // When the iframe is not loaded, IE raises an exception
              // on 'contentWindow'.
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
              }
            } catch (x) {
              // intentionally empty
            }
          }, 0);
        };

        iframe.src = iframeUrl;
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.onerror = function() {
          onerror('onerror');
        };
        iframe.onload = function() {
          // `onload` is triggered before scripts on the iframe are
          // executed. Give it few seconds to actually load stuff.
          clearTimeout(tref);
          tref = setTimeout(function() {
            onerror('onload timeout');
          }, 2000);
        };
        commonjsGlobal.document.body.appendChild(iframe);
        tref = setTimeout(function() {
          onerror('timeout');
        }, 15000);
        unloadRef = event$1.unloadAdd(cleanup);
        return {
          post: post
        , cleanup: cleanup
        , loaded: unattach
        };
      }

    /* eslint no-undef: "off", new-cap: "off" */
    , createHtmlfile: function(iframeUrl, errorCallback) {
        var axo = ['Active'].concat('Object').join('X');
        var doc = new commonjsGlobal[axo]('htmlfile');
        var tref, unloadRef;
        var iframe;
        var unattach = function() {
          clearTimeout(tref);
          iframe.onerror = null;
        };
        var cleanup = function() {
          if (doc) {
            unattach();
            event$1.unloadDel(unloadRef);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
          }
        };
        var onerror = function(r) {
          if (doc) {
            cleanup();
            errorCallback(r);
          }
        };
        var post = function(msg, origin) {
          try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            setTimeout(function() {
              if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.postMessage(msg, origin);
              }
            }, 0);
          } catch (x) {
            // intentionally empty
          }
        };

        doc.open();
        doc.write('<html><s' + 'cript>' +
                  'document.domain="' + commonjsGlobal.document.domain + '";' +
                  '</s' + 'cript></html>');
        doc.close();
        doc.parentWindow[module.exports.WPrefix] = commonjsGlobal[module.exports.WPrefix];
        var c = doc.createElement('div');
        doc.body.appendChild(c);
        iframe = doc.createElement('iframe');
        c.appendChild(iframe);
        iframe.src = iframeUrl;
        iframe.onerror = function() {
          onerror('onerror');
        };
        tref = setTimeout(function() {
          onerror('timeout');
        }, 15000);
        unloadRef = event$1.unloadAdd(cleanup);
        return {
          post: post
        , cleanup: cleanup
        , loaded: unattach
        };
      }
    };

    module.exports.iframeEnabled = false;
    if (commonjsGlobal.document) {
      // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
      // huge delay, or not at all.
      module.exports.iframeEnabled = (typeof commonjsGlobal.postMessage === 'function' ||
        typeof commonjsGlobal.postMessage === 'object') && (!browser.isKonqueror());
    }
    });

    // Few cool transports do work only for same-origin. In order to make
    // them work cross-domain we shall use iframe, served from the
    // remote domain. New browsers have capabilities to communicate with
    // cross domain iframe using postMessage(). In IE it was implemented
    // from IE 8+, but of course, IE got some details wrong:
    //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
    //    http://stevesouders.com/misc/test-postmessage.php

    var EventEmitter$7 = emitter.EventEmitter
      ;

    var debug$6 = function() {};

    function IframeTransport(transport, transUrl, baseUrl) {
      if (!IframeTransport.enabled()) {
        throw new Error('Transport created when disabled');
      }
      EventEmitter$7.call(this);

      var self = this;
      this.origin = url.getOrigin(baseUrl);
      this.baseUrl = baseUrl;
      this.transUrl = transUrl;
      this.transport = transport;
      this.windowId = random.string(8);

      var iframeUrl = url.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;

      this.iframeObj = iframe$1.createIframe(iframeUrl, function(r) {
        self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
        self.close();
      });

      this.onmessageCallback = this._message.bind(this);
      event$1.attachEvent('message', this.onmessageCallback);
    }

    inherits_browser(IframeTransport, EventEmitter$7);

    IframeTransport.prototype.close = function() {
      this.removeAllListeners();
      if (this.iframeObj) {
        event$1.detachEvent('message', this.onmessageCallback);
        try {
          // When the iframe is not loaded, IE raises an exception
          // on 'contentWindow'.
          this.postMessage('c');
        } catch (x) {
          // intentionally empty
        }
        this.iframeObj.cleanup();
        this.iframeObj = null;
        this.onmessageCallback = this.iframeObj = null;
      }
    };

    IframeTransport.prototype._message = function(e) {
      debug$6('message', e.data);
      if (!url.isOriginEqual(e.origin, this.origin)) {
        debug$6('not same origin', e.origin, this.origin);
        return;
      }

      var iframeMessage;
      try {
        iframeMessage = JSON.parse(e.data);
      } catch (ignored) {
        debug$6('bad json', e.data);
        return;
      }

      if (iframeMessage.windowId !== this.windowId) {
        debug$6('mismatched window id', iframeMessage.windowId, this.windowId);
        return;
      }

      switch (iframeMessage.type) {
      case 's':
        this.iframeObj.loaded();
        // window global dependency
        this.postMessage('s', JSON.stringify([
          version
        , this.transport
        , this.transUrl
        , this.baseUrl
        ]));
        break;
      case 't':
        this.emit('message', iframeMessage.data);
        break;
      case 'c':
        var cdata;
        try {
          cdata = JSON.parse(iframeMessage.data);
        } catch (ignored) {
          debug$6('bad json', iframeMessage.data);
          return;
        }
        this.emit('close', cdata[0], cdata[1]);
        this.close();
        break;
      }
    };

    IframeTransport.prototype.postMessage = function(type, data) {
      this.iframeObj.post(JSON.stringify({
        windowId: this.windowId
      , type: type
      , data: data || ''
      }), this.origin);
    };

    IframeTransport.prototype.send = function(message) {
      this.postMessage('m', message);
    };

    IframeTransport.enabled = function() {
      return iframe$1.iframeEnabled;
    };

    IframeTransport.transportName = 'iframe';
    IframeTransport.roundTrips = 2;

    var iframe = IframeTransport;

    var object = {
      isObject: function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      }

    , extend: function(obj) {
        if (!this.isObject(obj)) {
          return obj;
        }
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
          source = arguments[i];
          for (prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
              obj[prop] = source[prop];
            }
          }
        }
        return obj;
      }
    };

    var iframeWrap = function(transport) {

      function IframeWrapTransport(transUrl, baseUrl) {
        iframe.call(this, transport.transportName, transUrl, baseUrl);
      }

      inherits_browser(IframeWrapTransport, iframe);

      IframeWrapTransport.enabled = function(url, info) {
        if (!commonjsGlobal.document) {
          return false;
        }

        var iframeInfo = object.extend({}, info);
        iframeInfo.sameOrigin = true;
        return transport.enabled(iframeInfo) && iframe.enabled();
      };

      IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
      IframeWrapTransport.needBody = true;
      IframeWrapTransport.roundTrips = iframe.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

      IframeWrapTransport.facadeTransport = transport;

      return IframeWrapTransport;
    };

    var EventEmitter$6 = emitter.EventEmitter
      ;

    var debug$5 = function() {};

    function HtmlfileReceiver(url$1) {
      EventEmitter$6.call(this);
      var self = this;
      iframe$1.polluteGlobalNamespace();

      this.id = 'a' + random.string(6);
      url$1 = url.addQuery(url$1, 'c=' + decodeURIComponent(iframe$1.WPrefix + '.' + this.id));

      debug$5('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
      var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
          iframe$1.createHtmlfile : iframe$1.createIframe;

      commonjsGlobal[iframe$1.WPrefix][this.id] = {
        start: function() {
          self.iframeObj.loaded();
        }
      , message: function(data) {
          self.emit('message', data);
        }
      , stop: function() {
          self._cleanup();
          self._close('network');
        }
      };
      this.iframeObj = constructFunc(url$1, function() {
        self._cleanup();
        self._close('permanent');
      });
    }

    inherits_browser(HtmlfileReceiver, EventEmitter$6);

    HtmlfileReceiver.prototype.abort = function() {
      this._cleanup();
      this._close('user');
    };

    HtmlfileReceiver.prototype._cleanup = function() {
      if (this.iframeObj) {
        this.iframeObj.cleanup();
        this.iframeObj = null;
      }
      delete commonjsGlobal[iframe$1.WPrefix][this.id];
    };

    HtmlfileReceiver.prototype._close = function(reason) {
      this.emit('close', null, reason);
      this.removeAllListeners();
    };

    HtmlfileReceiver.htmlfileEnabled = false;

    // obfuscate to avoid firewalls
    var axo = ['Active'].concat('Object').join('X');
    if (axo in commonjsGlobal) {
      try {
        HtmlfileReceiver.htmlfileEnabled = !!new commonjsGlobal[axo]('htmlfile');
      } catch (x) {
        // intentionally empty
      }
    }

    HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframe$1.iframeEnabled;

    var htmlfile$1 = HtmlfileReceiver;

    function HtmlFileTransport(transUrl) {
      if (!htmlfile$1.enabled) {
        throw new Error('Transport created when disabled');
      }
      ajaxBased.call(this, transUrl, '/htmlfile', htmlfile$1, xhrLocal);
    }

    inherits_browser(HtmlFileTransport, ajaxBased);

    HtmlFileTransport.enabled = function(info) {
      return htmlfile$1.enabled && info.sameOrigin;
    };

    HtmlFileTransport.transportName = 'htmlfile';
    HtmlFileTransport.roundTrips = 2;

    var htmlfile = HtmlFileTransport;

    function XhrPollingTransport(transUrl) {
      if (!xhrLocal.enabled && !xhrCors.enabled) {
        throw new Error('Transport created when disabled');
      }
      ajaxBased.call(this, transUrl, '/xhr', xhr, xhrCors);
    }

    inherits_browser(XhrPollingTransport, ajaxBased);

    XhrPollingTransport.enabled = function(info) {
      if (info.nullOrigin) {
        return false;
      }

      if (xhrLocal.enabled && info.sameOrigin) {
        return true;
      }
      return xhrCors.enabled;
    };

    XhrPollingTransport.transportName = 'xhr-polling';
    XhrPollingTransport.roundTrips = 2; // preflight, ajax

    var xhrPolling = XhrPollingTransport;

    function XdrPollingTransport(transUrl) {
      if (!xdr.enabled) {
        throw new Error('Transport created when disabled');
      }
      ajaxBased.call(this, transUrl, '/xhr', xhr, xdr);
    }

    inherits_browser(XdrPollingTransport, ajaxBased);

    XdrPollingTransport.enabled = xdrStreaming.enabled;
    XdrPollingTransport.transportName = 'xdr-polling';
    XdrPollingTransport.roundTrips = 2; // preflight, ajax

    var xdrPolling = XdrPollingTransport;

    var EventEmitter$5 = emitter.EventEmitter
      ;

    var debug$4 = function() {};

    function JsonpReceiver(url$1) {
      var self = this;
      EventEmitter$5.call(this);

      iframe$1.polluteGlobalNamespace();

      this.id = 'a' + random.string(6);
      var urlWithId = url.addQuery(url$1, 'c=' + encodeURIComponent(iframe$1.WPrefix + '.' + this.id));

      commonjsGlobal[iframe$1.WPrefix][this.id] = this._callback.bind(this);
      this._createScript(urlWithId);

      // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
      this.timeoutId = setTimeout(function() {
        self._abort(new Error('JSONP script loaded abnormally (timeout)'));
      }, JsonpReceiver.timeout);
    }

    inherits_browser(JsonpReceiver, EventEmitter$5);

    JsonpReceiver.prototype.abort = function() {
      if (commonjsGlobal[iframe$1.WPrefix][this.id]) {
        var err = new Error('JSONP user aborted read');
        err.code = 1000;
        this._abort(err);
      }
    };

    JsonpReceiver.timeout = 35000;
    JsonpReceiver.scriptErrorTimeout = 1000;

    JsonpReceiver.prototype._callback = function(data) {
      this._cleanup();

      if (this.aborting) {
        return;
      }

      if (data) {
        this.emit('message', data);
      }
      this.emit('close', null, 'network');
      this.removeAllListeners();
    };

    JsonpReceiver.prototype._abort = function(err) {
      this._cleanup();
      this.aborting = true;
      this.emit('close', err.code, err.message);
      this.removeAllListeners();
    };

    JsonpReceiver.prototype._cleanup = function() {
      clearTimeout(this.timeoutId);
      if (this.script2) {
        this.script2.parentNode.removeChild(this.script2);
        this.script2 = null;
      }
      if (this.script) {
        var script = this.script;
        // Unfortunately, you can't really abort script loading of
        // the script.
        script.parentNode.removeChild(script);
        script.onreadystatechange = script.onerror =
            script.onload = script.onclick = null;
        this.script = null;
      }
      delete commonjsGlobal[iframe$1.WPrefix][this.id];
    };

    JsonpReceiver.prototype._scriptError = function() {
      var self = this;
      if (this.errorTimer) {
        return;
      }

      this.errorTimer = setTimeout(function() {
        if (!self.loadedOkay) {
          self._abort(new Error('JSONP script loaded abnormally (onerror)'));
        }
      }, JsonpReceiver.scriptErrorTimeout);
    };

    JsonpReceiver.prototype._createScript = function(url) {
      var self = this;
      var script = this.script = commonjsGlobal.document.createElement('script');
      var script2;  // Opera synchronous load trick.

      script.id = 'a' + random.string(8);
      script.src = url;
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.onerror = this._scriptError.bind(this);
      script.onload = function() {
        self._abort(new Error('JSONP script loaded abnormally (onload)'));
      };

      // IE9 fires 'error' event after onreadystatechange or before, in random order.
      // Use loadedOkay to determine if actually errored
      script.onreadystatechange = function() {
        debug$4('onreadystatechange', script.readyState);
        if (/loaded|closed/.test(script.readyState)) {
          if (script && script.htmlFor && script.onclick) {
            self.loadedOkay = true;
            try {
              // In IE, actually execute the script.
              script.onclick();
            } catch (x) {
              // intentionally empty
            }
          }
          if (script) {
            self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
          }
        }
      };
      // IE: event/htmlFor/onclick trick.
      // One can't rely on proper order for onreadystatechange. In order to
      // make sure, set a 'htmlFor' and 'event' properties, so that
      // script code will be installed as 'onclick' handler for the
      // script object. Later, onreadystatechange, manually execute this
      // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
      // set. For reference see:
      //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      // Also, read on that about script ordering:
      //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      if (typeof script.async === 'undefined' && commonjsGlobal.document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!browser.isOpera()) {
          // Naively assume we're in IE
          try {
            script.htmlFor = script.id;
            script.event = 'onclick';
          } catch (x) {
            // intentionally empty
          }
          script.async = true;
        } else {
          // Opera, second sync script hack
          script2 = this.script2 = commonjsGlobal.document.createElement('script');
          script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
          script.async = script2.async = false;
        }
      }
      if (typeof script.async !== 'undefined') {
        script.async = true;
      }

      var head = commonjsGlobal.document.getElementsByTagName('head')[0];
      head.insertBefore(script, head.firstChild);
      if (script2) {
        head.insertBefore(script2, head.firstChild);
      }
    };

    var jsonp$1 = JsonpReceiver;

    var debug$3 = function() {};

    var form, area;

    function createIframe(id) {
      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        return commonjsGlobal.document.createElement('<iframe name="' + id + '">');
      } catch (x) {
        var iframe = commonjsGlobal.document.createElement('iframe');
        iframe.name = id;
        return iframe;
      }
    }

    function createForm() {
      form = commonjsGlobal.document.createElement('form');
      form.style.display = 'none';
      form.style.position = 'absolute';
      form.method = 'POST';
      form.enctype = 'application/x-www-form-urlencoded';
      form.acceptCharset = 'UTF-8';

      area = commonjsGlobal.document.createElement('textarea');
      area.name = 'd';
      form.appendChild(area);

      commonjsGlobal.document.body.appendChild(form);
    }

    var jsonp = function(url$1, payload, callback) {
      if (!form) {
        createForm();
      }
      var id = 'a' + random.string(8);
      form.target = id;
      form.action = url.addQuery(url.addPath(url$1, '/jsonp_send'), 'i=' + id);

      var iframe = createIframe(id);
      iframe.id = id;
      iframe.style.display = 'none';
      form.appendChild(iframe);

      try {
        area.value = payload;
      } catch (e) {
        // seriously broken browsers get here
      }
      form.submit();

      var completed = function(err) {
        if (!iframe.onerror) {
          return;
        }
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        setTimeout(function() {
          iframe.parentNode.removeChild(iframe);
          iframe = null;
        }, 500);
        area.value = '';
        // It is not possible to detect if the iframe succeeded or
        // failed to submit our form.
        callback(err);
      };
      iframe.onerror = function() {
        completed();
      };
      iframe.onload = function() {
        completed();
      };
      iframe.onreadystatechange = function(e) {
        debug$3('onreadystatechange', id, iframe.readyState);
        if (iframe.readyState === 'complete') {
          completed();
        }
      };
      return function() {
        completed(new Error('Aborted'));
      };
    };

    // The simplest and most robust transport, using the well-know cross
    // domain hack - JSONP. This transport is quite inefficient - one
    // message could use up to one http request. But at least it works almost
    // everywhere.
    // Known limitations:
    //   o you will get a spinning cursor
    //   o for Konqueror a dumb timer is needed to detect errors



    function JsonPTransport(transUrl) {
      if (!JsonPTransport.enabled()) {
        throw new Error('Transport created when disabled');
      }
      senderReceiver.call(this, transUrl, '/jsonp', jsonp, jsonp$1);
    }

    inherits_browser(JsonPTransport, senderReceiver);

    JsonPTransport.enabled = function() {
      return !!commonjsGlobal.document;
    };

    JsonPTransport.transportName = 'jsonp-polling';
    JsonPTransport.roundTrips = 1;
    JsonPTransport.needBody = true;

    var jsonpPolling = JsonPTransport;

    var transportList = [
      // streaming transports
      websocket
    , xhrStreaming
    , xdrStreaming
    , eventsource
    , iframeWrap(eventsource)

      // polling transports
    , htmlfile
    , iframeWrap(htmlfile)
    , xhrPolling
    , xdrPolling
    , iframeWrap(xhrPolling)
    , jsonpPolling
    ];

    /* eslint-disable */

    // pulled specific shims from https://github.com/es-shims/es5-shim

    var ArrayPrototype = Array.prototype;
    var ObjectPrototype = Object.prototype;
    var FunctionPrototype = Function.prototype;
    var StringPrototype = String.prototype;
    var array_slice = ArrayPrototype.slice;

    var _toString = ObjectPrototype.toString;
    var isFunction = function (val) {
        return ObjectPrototype.toString.call(val) === '[object Function]';
    };
    var isArray = function isArray(obj) {
        return _toString.call(obj) === '[object Array]';
    };
    var isString = function isString(obj) {
        return _toString.call(obj) === '[object String]';
    };

    var supportsDescriptors = Object.defineProperty && (function () {
        try {
            Object.defineProperty({}, 'x', {});
            return true;
        } catch (e) { /* this is ES3 */
            return false;
        }
    }());

    // Define configurable, writable and non-enumerable props
    // if they don't exist.
    var defineProperty;
    if (supportsDescriptors) {
        defineProperty = function (object, name, method, forceAssign) {
            if (!forceAssign && (name in object)) { return; }
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: method
            });
        };
    } else {
        defineProperty = function (object, name, method, forceAssign) {
            if (!forceAssign && (name in object)) { return; }
            object[name] = method;
        };
    }
    var defineProperties = function (object, map, forceAssign) {
        for (var name in map) {
            if (ObjectPrototype.hasOwnProperty.call(map, name)) {
              defineProperty(object, name, map[name], forceAssign);
            }
        }
    };

    var toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
    };

    //
    // Util
    // ======
    //

    // ES5 9.4
    // http://es5.github.com/#x9.4
    // http://jsperf.com/to-integer

    function toInteger(num) {
        var n = +num;
        if (n !== n) { // isNaN
            n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
    }

    function ToUint32(x) {
        return x >>> 0;
    }

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    function Empty() {}

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isFunction(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = target.apply(
                        this,
                        args.concat(array_slice.call(arguments))
                    );
                    if (Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return target.apply(
                        that,
                        args.concat(array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = Math.max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                boundArgs.push('$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    //
    // Array
    // =====
    //

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties(Array, { isArray: isArray });


    var boxedString = Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        if (method) {
            method.call('foo', function (_, __, context) {
                if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
            });

            method.call([1], function () {
                properlyBoxesStrict = typeof this === 'string';
            }, 'x');
        }
        return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(fun /*, thisp*/) {
            var object = toObject(this),
                self = splitString && isString(this) ? this.split('') : object,
                thisp = arguments[1],
                i = -1,
                length = self.length >>> 0;

            // If no callback function or if callback is not a callable function
            if (!isFunction(fun)) {
                throw new TypeError(); // TODO message
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    // context
                    fun.call(thisp, self[i], i, object);
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(sought /*, fromIndex */ ) {
            var self = splitString && isString(this) ? this.split('') : toObject(this),
                length = self.length >>> 0;

            if (!length) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = toInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : Math.max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === sought) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    var string_split = StringPrototype.split;
    if (
        'ab'.split(/(?:ab)*/).length !== 2 ||
        '.'.split(/(.?)(.?)/).length !== 4 ||
        'tesst'.split(/(s)*/)[1] === 't' ||
        'test'.split(/(?:)/, -1).length !== 4 ||
        ''.split(/.?/).length ||
        '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

            StringPrototype.split = function (separator, limit) {
                var string = this;
                if (separator === void 0 && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (_toString.call(separator) !== '[object RegExp]') {
                    return string_split.call(this, separator, limit);
                }

                var output = [],
                    flags = (separator.ignoreCase ? 'i' : '') +
                            (separator.multiline  ? 'm' : '') +
                            (separator.extended   ? 'x' : '') + // Proposed for ES6
                            (separator.sticky     ? 'y' : ''), // Firefox 3+
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                separator = new RegExp(separator.source, flags + 'g');
                string += ''; // Type-convert
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // Math.pow(2, 32) - 1
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                limit = limit === void 0 ?
                    -1 >>> 0 : // Math.pow(2, 32) - 1
                    ToUint32(limit);
                while (match = separator.exec(string)) {
                    // `separator.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        output.push(string.slice(lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (arguments[i] === void 0) {
                                        match[i] = void 0;
                                    }
                                }
                            });
                        }
                        if (match.length > 1 && match.index < string.length) {
                            ArrayPrototype.push.apply(output, match.slice(1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= limit) {
                            break;
                        }
                    }
                    if (separator.lastIndex === match.index) {
                        separator.lastIndex++; // Avoid an infinite loop
                    }
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separator.test('')) {
                        output.push('');
                    }
                } else {
                    output.push(string.slice(lastLastIndex));
                }
                return output.length > limit ? output.slice(0, limit) : output;
            };
        }());

    // [bugfix, chrome]
    // If separator is undefined, then the result array contains just one String,
    // which is the this value (converted to a String). If limit is not undefined,
    // then the output array is truncated so that it contains no more than limit
    // elements.
    // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (separator === void 0 && limit === 0) { return []; }
            return string_split.call(this, separator, limit);
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            return string_substr.call(
                this,
                start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
                length
            );
        }
    }, hasNegativeSubstrBug);

    // Some extra characters that Chrome gets wrong, and substitutes with
    // something else on the wire.
    // eslint-disable-next-line no-control-regex, no-misleading-character-class
    var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
      , extraLookup;

    // This may be quite slow, so let's delay until user actually uses bad
    // characters.
    var unrollLookup = function(escapable) {
      var i;
      var unrolled = {};
      var c = [];
      for (i = 0; i < 65536; i++) {
        c.push( String.fromCharCode(i) );
      }
      escapable.lastIndex = 0;
      c.join('').replace(escapable, function(a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
      });
      escapable.lastIndex = 0;
      return unrolled;
    };

    // Quote string, also taking care of unicode characters that browsers
    // often break. Especially, take care of unicode surrogates:
    // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
    var _escape = {
      quote: function(string) {
        var quoted = JSON.stringify(string);

        // In most cases this should be very fast and good enough.
        extraEscapable.lastIndex = 0;
        if (!extraEscapable.test(quoted)) {
          return quoted;
        }

        if (!extraLookup) {
          extraLookup = unrollLookup(extraEscapable);
        }

        return quoted.replace(extraEscapable, function(a) {
          return extraLookup[a];
        });
      }
    };

    var debug$2 = function() {};

    var transport = function(availableTransports) {
      return {
        filterToEnabled: function(transportsWhitelist, info) {
          var transports = {
            main: []
          , facade: []
          };
          if (!transportsWhitelist) {
            transportsWhitelist = [];
          } else if (typeof transportsWhitelist === 'string') {
            transportsWhitelist = [transportsWhitelist];
          }

          availableTransports.forEach(function(trans) {
            if (!trans) {
              return;
            }

            if (trans.transportName === 'websocket' && info.websocket === false) {
              return;
            }

            if (transportsWhitelist.length &&
                transportsWhitelist.indexOf(trans.transportName) === -1) {
              debug$2('not in whitelist', trans.transportName);
              return;
            }

            if (trans.enabled(info)) {
              debug$2('enabled', trans.transportName);
              transports.main.push(trans);
              if (trans.facadeTransport) {
                transports.facade.push(trans.facadeTransport);
              }
            } else {
              debug$2('disabled', trans.transportName);
            }
          });
          return transports;
        }
      };
    };

    var logObject = {};
    ['log', 'debug', 'warn'].forEach(function (level) {
      var levelExists;

      try {
        levelExists = commonjsGlobal.console && commonjsGlobal.console[level] && commonjsGlobal.console[level].apply;
      } catch(e) {
        // do nothing
      }

      logObject[level] = levelExists ? function () {
        return commonjsGlobal.console[level].apply(commonjsGlobal.console, arguments);
      } : (level === 'log' ? function () {} : logObject.log);
    });

    var log = logObject;

    function Event$1(eventType) {
      this.type = eventType;
    }

    Event$1.prototype.initEvent = function(eventType, canBubble, cancelable) {
      this.type = eventType;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
      this.timeStamp = +new Date();
      return this;
    };

    Event$1.prototype.stopPropagation = function() {};
    Event$1.prototype.preventDefault = function() {};

    Event$1.CAPTURING_PHASE = 1;
    Event$1.AT_TARGET = 2;
    Event$1.BUBBLING_PHASE = 3;

    var event = Event$1;

    var location$1 = commonjsGlobal.location || {
      origin: 'http://localhost:80'
    , protocol: 'http:'
    , host: 'localhost'
    , port: 80
    , href: 'http://localhost/'
    , hash: ''
    };

    function CloseEvent() {
      event.call(this);
      this.initEvent('close', false, false);
      this.wasClean = false;
      this.code = 0;
      this.reason = '';
    }

    inherits_browser(CloseEvent, event);

    var close = CloseEvent;

    function TransportMessageEvent(data) {
      event.call(this);
      this.initEvent('message', false, false);
      this.data = data;
    }

    inherits_browser(TransportMessageEvent, event);

    var transMessage = TransportMessageEvent;

    var EventEmitter$4 = emitter.EventEmitter
      ;

    function XHRFake(/* method, url, payload, opts */) {
      var self = this;
      EventEmitter$4.call(this);

      this.to = setTimeout(function() {
        self.emit('finish', 200, '{}');
      }, XHRFake.timeout);
    }

    inherits_browser(XHRFake, EventEmitter$4);

    XHRFake.prototype.close = function() {
      clearTimeout(this.to);
    };

    XHRFake.timeout = 2000;

    var xhrFake = XHRFake;

    var EventEmitter$3 = emitter.EventEmitter
      ;

    function InfoAjax(url, AjaxObject) {
      EventEmitter$3.call(this);

      var self = this;
      var t0 = +new Date();
      this.xo = new AjaxObject('GET', url);

      this.xo.once('finish', function(status, text) {
        var info, rtt;
        if (status === 200) {
          rtt = (+new Date()) - t0;
          if (text) {
            try {
              info = JSON.parse(text);
            } catch (e) {
            }
          }

          if (!object.isObject(info)) {
            info = {};
          }
        }
        self.emit('finish', info, rtt);
        self.removeAllListeners();
      });
    }

    inherits_browser(InfoAjax, EventEmitter$3);

    InfoAjax.prototype.close = function() {
      this.removeAllListeners();
      this.xo.close();
    };

    var infoAjax = InfoAjax;

    var EventEmitter$2 = emitter.EventEmitter
      ;

    function InfoReceiverIframe(transUrl) {
      var self = this;
      EventEmitter$2.call(this);

      this.ir = new infoAjax(transUrl, xhrLocal);
      this.ir.once('finish', function(info, rtt) {
        self.ir = null;
        self.emit('message', JSON.stringify([info, rtt]));
      });
    }

    inherits_browser(InfoReceiverIframe, EventEmitter$2);

    InfoReceiverIframe.transportName = 'iframe-info-receiver';

    InfoReceiverIframe.prototype.close = function() {
      if (this.ir) {
        this.ir.close();
        this.ir = null;
      }
      this.removeAllListeners();
    };

    var infoIframeReceiver = InfoReceiverIframe;

    var EventEmitter$1 = emitter.EventEmitter
      ;

    function InfoIframe(baseUrl, url) {
      var self = this;
      EventEmitter$1.call(this);

      var go = function() {
        var ifr = self.ifr = new iframe(infoIframeReceiver.transportName, url, baseUrl);

        ifr.once('message', function(msg) {
          if (msg) {
            var d;
            try {
              d = JSON.parse(msg);
            } catch (e) {
              self.emit('finish');
              self.close();
              return;
            }

            var info = d[0], rtt = d[1];
            self.emit('finish', info, rtt);
          }
          self.close();
        });

        ifr.once('close', function() {
          self.emit('finish');
          self.close();
        });
      };

      // TODO this seems the same as the 'needBody' from transports
      if (!commonjsGlobal.document.body) {
        event$1.attachEvent('load', go);
      } else {
        go();
      }
    }

    inherits_browser(InfoIframe, EventEmitter$1);

    InfoIframe.enabled = function() {
      return iframe.enabled();
    };

    InfoIframe.prototype.close = function() {
      if (this.ifr) {
        this.ifr.close();
      }
      this.removeAllListeners();
      this.ifr = null;
    };

    var infoIframe = InfoIframe;

    var EventEmitter = emitter.EventEmitter
      ;

    function InfoReceiver(baseUrl, urlInfo) {
      var self = this;
      EventEmitter.call(this);

      setTimeout(function() {
        self.doXhr(baseUrl, urlInfo);
      }, 0);
    }

    inherits_browser(InfoReceiver, EventEmitter);

    // TODO this is currently ignoring the list of available transports and the whitelist

    InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
      // determine method of CORS support (if needed)
      if (urlInfo.sameOrigin) {
        return new infoAjax(url, xhrLocal);
      }
      if (xhrCors.enabled) {
        return new infoAjax(url, xhrCors);
      }
      if (xdr.enabled && urlInfo.sameScheme) {
        return new infoAjax(url, xdr);
      }
      if (infoIframe.enabled()) {
        return new infoIframe(baseUrl, url);
      }
      return new infoAjax(url, xhrFake);
    };

    InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
      var self = this
        , url$1 = url.addPath(baseUrl, '/info')
        ;

      this.xo = InfoReceiver._getReceiver(baseUrl, url$1, urlInfo);

      this.timeoutRef = setTimeout(function() {
        self._cleanup(false);
        self.emit('finish');
      }, InfoReceiver.timeout);

      this.xo.once('finish', function(info, rtt) {
        self._cleanup(true);
        self.emit('finish', info, rtt);
      });
    };

    InfoReceiver.prototype._cleanup = function(wasClean) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
      if (!wasClean && this.xo) {
        this.xo.close();
      }
      this.xo = null;
    };

    InfoReceiver.prototype.close = function() {
      this.removeAllListeners();
      this._cleanup(false);
    };

    InfoReceiver.timeout = 8000;

    var infoReceiver = InfoReceiver;

    function FacadeJS(transport) {
      this._transport = transport;
      transport.on('message', this._transportMessage.bind(this));
      transport.on('close', this._transportClose.bind(this));
    }

    FacadeJS.prototype._transportClose = function(code, reason) {
      iframe$1.postMessage('c', JSON.stringify([code, reason]));
    };
    FacadeJS.prototype._transportMessage = function(frame) {
      iframe$1.postMessage('t', frame);
    };
    FacadeJS.prototype._send = function(data) {
      this._transport.send(data);
    };
    FacadeJS.prototype._close = function() {
      this._transport.close();
      this._transport.removeAllListeners();
    };

    var facade = FacadeJS;

    var debug$1 = function() {};

    var iframeBootstrap = function(SockJS, availableTransports) {
      var transportMap = {};
      availableTransports.forEach(function(at) {
        if (at.facadeTransport) {
          transportMap[at.facadeTransport.transportName] = at.facadeTransport;
        }
      });

      // hard-coded for the info iframe
      // TODO see if we can make this more dynamic
      transportMap[infoIframeReceiver.transportName] = infoIframeReceiver;
      var parentOrigin;

      /* eslint-disable camelcase */
      SockJS.bootstrap_iframe = function() {
        /* eslint-enable camelcase */
        var facade$1;
        iframe$1.currentWindowId = location$1.hash.slice(1);
        var onMessage = function(e) {
          if (e.source !== parent) {
            return;
          }
          if (typeof parentOrigin === 'undefined') {
            parentOrigin = e.origin;
          }
          if (e.origin !== parentOrigin) {
            return;
          }

          var iframeMessage;
          try {
            iframeMessage = JSON.parse(e.data);
          } catch (ignored) {
            debug$1('bad json', e.data);
            return;
          }

          if (iframeMessage.windowId !== iframe$1.currentWindowId) {
            return;
          }
          switch (iframeMessage.type) {
          case 's':
            var p;
            try {
              p = JSON.parse(iframeMessage.data);
            } catch (ignored) {
              debug$1('bad json', iframeMessage.data);
              break;
            }
            var version = p[0];
            var transport = p[1];
            var transUrl = p[2];
            var baseUrl = p[3];
            // change this to semver logic
            if (version !== SockJS.version) {
              throw new Error('Incompatible SockJS! Main site uses:' +
                        ' "' + version + '", the iframe:' +
                        ' "' + SockJS.version + '".');
            }

            if (!url.isOriginEqual(transUrl, location$1.href) ||
                !url.isOriginEqual(baseUrl, location$1.href)) {
              throw new Error('Can\'t connect to different domain from within an ' +
                        'iframe. (' + location$1.href + ', ' + transUrl + ', ' + baseUrl + ')');
            }
            facade$1 = new facade(new transportMap[transport](transUrl, baseUrl));
            break;
          case 'm':
            facade$1._send(iframeMessage.data);
            break;
          case 'c':
            if (facade$1) {
              facade$1._close();
            }
            facade$1 = null;
            break;
          }
        };

        event$1.attachEvent('message', onMessage);

        // Start
        iframe$1.postMessage('s');
      };
    };

    var debug = function() {};

    var transports;

    // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
    function SockJS(url$1, protocols, options) {
      if (!(this instanceof SockJS)) {
        return new SockJS(url$1, protocols, options);
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
      }
      eventtarget.call(this);

      this.readyState = SockJS.CONNECTING;
      this.extensions = '';
      this.protocol = '';

      // non-standard extension
      options = options || {};
      if (options.protocols_whitelist) {
        log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
      }
      this._transportsWhitelist = options.transports;
      this._transportOptions = options.transportOptions || {};
      this._timeout = options.timeout || 0;

      var sessionId = options.sessionId || 8;
      if (typeof sessionId === 'function') {
        this._generateSessionId = sessionId;
      } else if (typeof sessionId === 'number') {
        this._generateSessionId = function() {
          return random.string(sessionId);
        };
      } else {
        throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
      }

      this._server = options.server || random.numberString(1000);

      // Step 1 of WS spec - parse and validate the url. Issue #8
      var parsedUrl = new urlParse(url$1);
      if (!parsedUrl.host || !parsedUrl.protocol) {
        throw new SyntaxError("The URL '" + url$1 + "' is invalid");
      } else if (parsedUrl.hash) {
        throw new SyntaxError('The URL must not contain a fragment');
      } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
      }

      var secure = parsedUrl.protocol === 'https:';
      // Step 2 - don't allow secure origin with an insecure protocol
      if (location$1.protocol === 'https:' && !secure) {
        // exception is 127.0.0.0/8 and ::1 urls
        if (!url.isLoopbackAddr(parsedUrl.hostname)) {
          throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
        }
      }

      // Step 3 - check port access - no need here
      // Step 4 - parse protocols argument
      if (!protocols) {
        protocols = [];
      } else if (!Array.isArray(protocols)) {
        protocols = [protocols];
      }

      // Step 5 - check protocols argument
      var sortedProtocols = protocols.sort();
      sortedProtocols.forEach(function(proto, i) {
        if (!proto) {
          throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
        }
        if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
          throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
        }
      });

      // Step 6 - convert origin
      var o = url.getOrigin(location$1.href);
      this._origin = o ? o.toLowerCase() : null;

      // remove the trailing slash
      parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

      // store the sanitized url
      this.url = parsedUrl.href;
      debug('using url', this.url);

      // Step 7 - start connection in background
      // obtain server info
      // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
      this._urlInfo = {
        nullOrigin: !browser.hasDomain()
      , sameOrigin: url.isOriginEqual(this.url, location$1.href)
      , sameScheme: url.isSchemeEqual(this.url, location$1.href)
      };

      this._ir = new infoReceiver(this.url, this._urlInfo);
      this._ir.once('finish', this._receiveInfo.bind(this));
    }

    inherits_browser(SockJS, eventtarget);

    function userSetCode(code) {
      return code === 1000 || (code >= 3000 && code <= 4999);
    }

    SockJS.prototype.close = function(code, reason) {
      // Step 1
      if (code && !userSetCode(code)) {
        throw new Error('InvalidAccessError: Invalid code');
      }
      // Step 2.4 states the max is 123 bytes, but we are just checking length
      if (reason && reason.length > 123) {
        throw new SyntaxError('reason argument has an invalid length');
      }

      // Step 3.1
      if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
        return;
      }

      // TODO look at docs to determine how to set this
      var wasClean = true;
      this._close(code || 1000, reason || 'Normal closure', wasClean);
    };

    SockJS.prototype.send = function(data) {
      // #13 - convert anything non-string to string
      // TODO this currently turns objects into [object Object]
      if (typeof data !== 'string') {
        data = '' + data;
      }
      if (this.readyState === SockJS.CONNECTING) {
        throw new Error('InvalidStateError: The connection has not been established yet');
      }
      if (this.readyState !== SockJS.OPEN) {
        return;
      }
      this._transport.send(_escape.quote(data));
    };

    SockJS.version = version;

    SockJS.CONNECTING = 0;
    SockJS.OPEN = 1;
    SockJS.CLOSING = 2;
    SockJS.CLOSED = 3;

    SockJS.prototype._receiveInfo = function(info, rtt) {
      this._ir = null;
      if (!info) {
        this._close(1002, 'Cannot connect to server');
        return;
      }

      // establish a round-trip timeout (RTO) based on the
      // round-trip time (RTT)
      this._rto = this.countRTO(rtt);
      // allow server to override url used for the actual transport
      this._transUrl = info.base_url ? info.base_url : this.url;
      info = object.extend(info, this._urlInfo);
      // determine list of desired and supported transports
      var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
      this._transports = enabledTransports.main;
      debug(this._transports.length + ' enabled transports');

      this._connect();
    };

    SockJS.prototype._connect = function() {
      for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
        debug('attempt', Transport.transportName);
        if (Transport.needBody) {
          if (!commonjsGlobal.document.body ||
              (typeof commonjsGlobal.document.readyState !== 'undefined' &&
                commonjsGlobal.document.readyState !== 'complete' &&
                commonjsGlobal.document.readyState !== 'interactive')) {
            this._transports.unshift(Transport);
            event$1.attachEvent('load', this._connect.bind(this));
            return;
          }
        }

        // calculate timeout based on RTO and round trips. Default to 5s
        var timeoutMs = Math.max(this._timeout, (this._rto * Transport.roundTrips) || 5000);
        this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);

        var transportUrl = url.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
        var options = this._transportOptions[Transport.transportName];
        var transportObj = new Transport(transportUrl, this._transUrl, options);
        transportObj.on('message', this._transportMessage.bind(this));
        transportObj.once('close', this._transportClose.bind(this));
        transportObj.transportName = Transport.transportName;
        this._transport = transportObj;

        return;
      }
      this._close(2000, 'All transports failed', false);
    };

    SockJS.prototype._transportTimeout = function() {
      if (this.readyState === SockJS.CONNECTING) {
        if (this._transport) {
          this._transport.close();
        }

        this._transportClose(2007, 'Transport timed out');
      }
    };

    SockJS.prototype._transportMessage = function(msg) {
      var self = this
        , type = msg.slice(0, 1)
        , content = msg.slice(1)
        , payload
        ;

      // first check for messages that don't need a payload
      switch (type) {
        case 'o':
          this._open();
          return;
        case 'h':
          this.dispatchEvent(new event('heartbeat'));
          debug('heartbeat', this.transport);
          return;
      }

      if (content) {
        try {
          payload = JSON.parse(content);
        } catch (e) {
        }
      }

      if (typeof payload === 'undefined') {
        return;
      }

      switch (type) {
        case 'a':
          if (Array.isArray(payload)) {
            payload.forEach(function(p) {
              debug('message', self.transport);
              self.dispatchEvent(new transMessage(p));
            });
          }
          break;
        case 'm':
          debug('message', this.transport);
          this.dispatchEvent(new transMessage(payload));
          break;
        case 'c':
          if (Array.isArray(payload) && payload.length === 2) {
            this._close(payload[0], payload[1], true);
          }
          break;
      }
    };

    SockJS.prototype._transportClose = function(code, reason) {
      debug('_transportClose', this.transport);
      if (this._transport) {
        this._transport.removeAllListeners();
        this._transport = null;
        this.transport = null;
      }

      if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
        this._connect();
        return;
      }

      this._close(code, reason);
    };

    SockJS.prototype._open = function() {
      debug('_open', this._transport && this._transport.transportName, this.readyState);
      if (this.readyState === SockJS.CONNECTING) {
        if (this._transportTimeoutId) {
          clearTimeout(this._transportTimeoutId);
          this._transportTimeoutId = null;
        }
        this.readyState = SockJS.OPEN;
        this.transport = this._transport.transportName;
        this.dispatchEvent(new event('open'));
        debug('connected', this.transport);
      } else {
        // The server might have been restarted, and lost track of our
        // connection.
        this._close(1006, 'Server lost session');
      }
    };

    SockJS.prototype._close = function(code, reason, wasClean) {
      debug('_close', this.transport, code, reason, wasClean, this.readyState);
      var forceFail = false;

      if (this._ir) {
        forceFail = true;
        this._ir.close();
        this._ir = null;
      }
      if (this._transport) {
        this._transport.close();
        this._transport = null;
        this.transport = null;
      }

      if (this.readyState === SockJS.CLOSED) {
        throw new Error('InvalidStateError: SockJS has already been closed');
      }

      this.readyState = SockJS.CLOSING;
      setTimeout(function() {
        this.readyState = SockJS.CLOSED;

        if (forceFail) {
          this.dispatchEvent(new event('error'));
        }

        var e = new close();
        e.wasClean = wasClean || false;
        e.code = code || 1000;
        e.reason = reason;

        this.dispatchEvent(e);
        this.onmessage = this.onclose = this.onerror = null;
      }.bind(this), 0);
    };

    // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
    // and RFC 2988.
    SockJS.prototype.countRTO = function(rtt) {
      // In a local environment, when using IE8/9 and the `jsonp-polling`
      // transport the time needed to establish a connection (the time that pass
      // from the opening of the transport to the call of `_dispatchOpen`) is
      // around 200msec (the lower bound used in the article above) and this
      // causes spurious timeouts. For this reason we calculate a value slightly
      // larger than that used in the article.
      if (rtt > 100) {
        return 4 * rtt; // rto > 400msec
      }
      return 300 + rtt; // 300msec < rto <= 400msec
    };

    var main = function(availableTransports) {
      transports = transport(availableTransports);
      iframeBootstrap(SockJS, availableTransports);
      return SockJS;
    };

    var entry = main(transportList);

    // TODO can't get rid of this until all servers do
    if ('_sockjs_onload' in commonjsGlobal) {
      setTimeout(commonjsGlobal._sockjs_onload, 1);
    }

    /* src/components/ChatRoom.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file$k = "src/components/ChatRoom.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (101:3) {:else}
    function create_else_block$9(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*log*/ ctx[13].id + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*log*/ ctx[13].message + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(div0, file$k, 102, 5, 2529);
    			attr_dev(div1, "class", "message message_other svelte-8qmjsi");
    			add_location(div1, file$k, 103, 5, 2554);
    			attr_dev(div2, "class", "chat chat_other svelte-8qmjsi");
    			add_location(div2, file$k, 101, 3, 2494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chat_logs*/ 4 && t0_value !== (t0_value = /*log*/ ctx[13].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*chat_logs*/ 4 && t2_value !== (t2_value = /*log*/ ctx[13].message + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(101:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:3) {#if log.id == $user?.githubId}
    function create_if_block$9(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*log*/ ctx[13].message + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "나";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(div0, file$k, 97, 5, 2399);
    			attr_dev(div1, "class", "message message_my svelte-8qmjsi");
    			add_location(div1, file$k, 98, 5, 2417);
    			attr_dev(div2, "class", "chat chat_my svelte-8qmjsi");
    			add_location(div2, file$k, 96, 4, 2367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chat_logs*/ 4 && t2_value !== (t2_value = /*log*/ ctx[13].message + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(96:3) {#if log.id == $user?.githubId}",
    		ctx
    	});

    	return block;
    }

    // (95:2) {#each chat_logs as log}
    function create_each_block$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*log*/ ctx[13].id == /*$user*/ ctx[3]?.githubId) return create_if_block$9;
    		return create_else_block$9;
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
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(95:2) {#each chat_logs as log}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let input;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*chat_logs*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			input = element("input");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Send Message";
    			attr_dev(div0, "class", "chat_room_upper svelte-8qmjsi");
    			add_location(div0, file$k, 92, 1, 2209);
    			attr_dev(div1, "id", "chat_room_body");
    			attr_dev(div1, "class", "chat_room_body svelte-8qmjsi");
    			add_location(div1, file$k, 93, 1, 2252);
    			attr_dev(input, "class", "chat_room_write svelte-8qmjsi");
    			attr_dev(input, "type", "text");
    			add_location(input, file$k, 108, 1, 2648);
    			add_location(button, file$k, 109, 1, 2741);
    			attr_dev(div2, "class", "chat_room svelte-8qmjsi");
    			add_location(div2, file$k, 91, 0, 2184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, input);
    			set_input_value(input, /*message*/ ctx[1]);
    			append_dev(div2, t3);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keypress", /*onKeyPress*/ ctx[4], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(button, "click", /*publish*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);

    			if (dirty & /*chat_logs, $user*/ 12) {
    				each_value = /*chat_logs*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*message*/ 2 && input.value !== /*message*/ ctx[1]) {
    				set_input_value(input, /*message*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChatRoom', slots, []);
    	let { name } = $$props;
    	let { id } = $$props;
    	let message = '';
    	let client;
    	let sub;

    	let chat_logs = [
    		{
    			id: 'user1',
    			message: '내용1',
    			createdAt: '22-07-03 16:11'
    		},
    		{
    			id: 'user1',
    			message: '내용2',
    			createdAt: '22-07-03 16:11'
    		},
    		{
    			id: 'tnghd5761',
    			message: '내 메세지1',
    			createdAt: '22-07-03 16:12'
    		},
    		{
    			id: 'user1',
    			message: '내용3',
    			createdAt: '22-07-03 16:12'
    		},
    		{
    			id: 'tnghd5761',
    			message: '내 메세지2',
    			createdAt: '22-07-03 16:12'
    		},
    		{
    			id: 'user1',
    			message: '내용4',
    			createdAt: '22-07-03 16:14'
    		},
    		{
    			id: 'user1',
    			message: '내용5',
    			createdAt: '22-07-03 16:15'
    		},
    		{
    			id: 'tnghd5761',
    			message: '내 메세지3',
    			createdAt: '22-07-03 16:15'
    		},
    		{
    			id: 'tnghd5761',
    			message: '내 메세지4',
    			createdAt: '22-07-03 16:16'
    		}
    	];

    	const scrollDown = () => {
    		var objDiv = document.getElementById("chat_room_body");
    		objDiv.scrollTop = objDiv.scrollHeight;
    	};

    	const onKeyPress = e => {
    		if (e.charCode === 13) publish();
    	};

    	const connect = () => {
    		client = new Client({
    				webSocketFactory: () => new entry("https://grabit-backend.link/api/stomp/chat"), // proxy를 통한 접속
    				connectHeaders: { "auth-token": "spring-chat-auth-token" },
    				reconnectDelay: 5000,
    				heartbeatIncoming: 4000,
    				heartbeatOutgoing: 4000,
    				onConnect: () => {
    					sub = client.subscribe('/sub/chat', onReceive);
    				},
    				onStompError: frame => {
    					console.error(frame);
    				}
    			});

    		client.activate();
    	};

    	// const disconnect = () => {
    	// 	client.deactivate();
    	// };
    	const onReceive = message => {
    		const new_chat = JSON.parse(message.body);
    		$$invalidate(2, chat_logs = [...chat_logs, new_chat]);
    	};

    	const publish = () => {
    		if (!client.connected) {
    			return;
    		}

    		const new_chat = JSON.stringify({
    			id: $user?.githubId,
    			message,
    			createdAt: '22-07-14 16:11'
    		});

    		client.publish({ destination: "/sub/chat", body: new_chat });
    		$$invalidate(1, message = "");
    	};

    	onMount(() => {
    		connect();
    		scrollDown();
    	});

    	useEffect(
    		() => {
    			scrollDown();
    		},
    		() => [chat_logs]
    	);

    	const writable_props = ['name', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ChatRoom> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		message = this.value;
    		$$invalidate(1, message);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		user,
    		onMount,
    		useEffect,
    		StompJs,
    		SockJS: entry,
    		name,
    		id,
    		message,
    		client,
    		sub,
    		chat_logs,
    		scrollDown,
    		onKeyPress,
    		connect,
    		onReceive,
    		publish,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('client' in $$props) client = $$props.client;
    		if ('sub' in $$props) sub = $$props.sub;
    		if ('chat_logs' in $$props) $$invalidate(2, chat_logs = $$props.chat_logs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, message, chat_logs, $user, onKeyPress, publish, id, input_input_handler];
    }

    class ChatRoom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { name: 0, id: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatRoom",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1.warn("<ChatRoom> was created without expected prop 'name'");
    		}

    		if (/*id*/ ctx[6] === undefined && !('id' in props)) {
    			console_1.warn("<ChatRoom> was created without expected prop 'id'");
    		}
    	}

    	get name() {
    		throw new Error("<ChatRoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ChatRoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChatRoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChatRoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ChatButton.svelte generated by Svelte v3.46.3 */
    const file$j = "src/components/ChatButton.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (57:0) {:else}
    function create_else_block_1$3(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chat_btn svelte-1u4kljk");
    			add_location(div, file$j, 57, 1, 1332);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(57:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {#if isOpen}
    function create_if_block$8(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let t3;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$7, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*chat_on*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "←";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "chat_upper_home svelte-1u4kljk");
    			add_location(div0, file$j, 37, 3, 818);
    			attr_dev(div1, "class", "close svelte-1u4kljk");
    			add_location(div1, file$j, 38, 3, 877);
    			attr_dev(div2, "class", "chat_upper svelte-1u4kljk");
    			add_location(div2, file$j, 36, 2, 790);
    			add_location(div3, file$j, 54, 2, 1303);
    			attr_dev(div4, "class", "chat svelte-1u4kljk");
    			add_location(div4, file$j, 35, 1, 769);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div4, t2);
    			if_blocks[current_block_type_index].m(div4, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*chatOff*/ ctx[6], false, false, false),
    					listen_dev(div1, "click", /*onClick*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

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
    				if_block.m(div4, t3);
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
    			if (detaching) detach_dev(div4);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(35:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$8(ctx) {
    	let div;
    	let each_value = /*challengeList*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "chat_main svelte-1u4kljk");
    			add_location(div, file$j, 43, 3, 1052);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chatOn, challengeList*/ 40) {
    				each_value = /*challengeList*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if chat_on}
    function create_if_block_1$7(ctx) {
    	let chatroom;
    	let current;

    	chatroom = new ChatRoom({
    			props: {
    				name: /*challengeList*/ ctx[3][/*challenge_code*/ ctx[0]].name,
    				id: /*challengeList*/ ctx[3][/*challenge_code*/ ctx[0]].id
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chatroom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatroom, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chatroom_changes = {};
    			if (dirty & /*challengeList, challenge_code*/ 9) chatroom_changes.name = /*challengeList*/ ctx[3][/*challenge_code*/ ctx[0]].name;
    			if (dirty & /*challengeList, challenge_code*/ 9) chatroom_changes.id = /*challengeList*/ ctx[3][/*challenge_code*/ ctx[0]].id;
    			chatroom.$set(chatroom_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatroom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatroom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatroom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(41:2) {#if chat_on}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#each challengeList as challenge, idx}
    function create_each_block$a(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*challenge*/ ctx[8].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*idx*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "last chat";
    			t3 = space();
    			add_location(div0, file$j, 48, 6, 1204);
    			add_location(div1, file$j, 49, 6, 1238);
    			attr_dev(div2, "class", "chat_main_room svelte-1u4kljk");
    			add_location(div2, file$j, 45, 5, 1125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t3);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*challengeList*/ 8 && t0_value !== (t0_value = /*challenge*/ ctx[8].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(45:4) {#each challengeList as challenge, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block_1$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isOpen*/ ctx[2]) return 0;
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChatButton', slots, []);
    	let challenge_code = null;
    	let chat_on = false;
    	let isOpen = false;
    	let challengeList;

    	function onClick() {
    		$$invalidate(2, isOpen = !isOpen);
    	}

    	function chatOn(idx) {
    		$$invalidate(1, chat_on = true);
    		$$invalidate(0, challenge_code = idx);
    	}

    	function chatOff() {
    		$$invalidate(1, chat_on = false);
    		$$invalidate(0, challenge_code = null);
    	}

    	//페이지 url에 따른 채팅창 open : 추후 구현
    	//onMount(() => {
    	//	if ($location.split('/')[1] == "challenge"){
    	//		challenge_code = $location.split('/')[2];
    	//	};
    	//})
    	onMount(async () => {
    		$$invalidate(3, challengeList = await getUserChallenge());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChatButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = idx => {
    		chatOn(idx);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		location: location$2,
    		user,
    		getUserChallenge,
    		ChatRoom,
    		challenge_code,
    		chat_on,
    		isOpen,
    		challengeList,
    		onClick,
    		chatOn,
    		chatOff
    	});

    	$$self.$inject_state = $$props => {
    		if ('challenge_code' in $$props) $$invalidate(0, challenge_code = $$props.challenge_code);
    		if ('chat_on' in $$props) $$invalidate(1, chat_on = $$props.chat_on);
    		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
    		if ('challengeList' in $$props) $$invalidate(3, challengeList = $$props.challengeList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		challenge_code,
    		chat_on,
    		isOpen,
    		challengeList,
    		onClick,
    		chatOn,
    		chatOff,
    		click_handler
    	];
    }

    class ChatButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatButton",
    			options,
    			id: create_fragment$k.name
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

    /* src/components/GlobalNavigationBar.svelte generated by Svelte v3.46.3 */
    const file$i = "src/components/GlobalNavigationBar.svelte";

    function create_fragment$j(ctx) {
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
    			t0 = text("My Challenges\n\t\t");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			t2 = text("View Other Challenges\n\t\t");
    			div2 = element("div");
    			attr_dev(div0, "class", "bar svelte-1smd1ck");
    			add_location(div0, file$i, 25, 2, 555);
    			attr_dev(div1, "class", div1_class_value = "gnb_menu " + /*classNames*/ ctx[0][0] + " svelte-1smd1ck");
    			add_location(div1, file$i, 23, 1, 477);
    			attr_dev(div2, "class", "bar svelte-1smd1ck");
    			add_location(div2, file$i, 29, 2, 673);
    			attr_dev(div3, "class", div3_class_value = "gnb_menu " + /*classNames*/ ctx[0][1] + " svelte-1smd1ck");
    			add_location(div3, file$i, 27, 1, 584);
    			attr_dev(div4, "class", "gnb svelte-1smd1ck");
    			add_location(div4, file$i, 22, 0, 458);
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
    				dispose = [
    					listen_dev(div1, "click", /*onClickMy*/ ctx[1], false, false, false),
    					listen_dev(div3, "click", /*onClickTotal*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classNames*/ 1 && div1_class_value !== (div1_class_value = "gnb_menu " + /*classNames*/ ctx[0][0] + " svelte-1smd1ck")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*classNames*/ 1 && div3_class_value !== (div3_class_value = "gnb_menu " + /*classNames*/ ctx[0][1] + " svelte-1smd1ck")) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
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
    	let $tabIndex;
    	validate_store(tabIndex, 'tabIndex');
    	component_subscribe($$self, tabIndex, $$value => $$invalidate(3, $tabIndex = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GlobalNavigationBar', slots, []);
    	let classNames = ['', ''];

    	function onClickMy() {
    		push$1('/mychallenge');
    	}

    	function onClickTotal() {
    		push$1('/totalchallenge');
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
    		push: push$1,
    		beforeUpdate,
    		afterUpdate,
    		tabIndex,
    		changeTab,
    		index,
    		classNames,
    		onClickMy,
    		onClickTotal,
    		$tabIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('classNames' in $$props) $$invalidate(0, classNames = $$props.classNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classNames, onClickMy, onClickTotal];
    }

    class GlobalNavigationBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GlobalNavigationBar",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/Profile.svelte generated by Svelte v3.46.3 */
    const file$h = "src/components/Profile.svelte";

    // (21:1) {:else}
    function create_else_block$7(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t2;
    	let button;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			div.textContent = "Guest";
    			t2 = space();
    			button = element("button");
    			p = element("p");
    			p.textContent = "Sign in";
    			attr_dev(img, "class", "profile__img svelte-gid2k0");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "default_image_grabit_logo");
    			add_location(img, file$h, 21, 2, 574);
    			attr_dev(div, "class", "profile__id svelte-gid2k0");
    			add_location(div, file$h, 22, 2, 664);
    			add_location(p, file$h, 24, 3, 756);
    			attr_dev(button, "class", "edit_btn svelte-gid2k0");
    			add_location(button, file$h, 23, 2, 703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, p);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onClickLogin*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(21:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:1) {#if $user}
    function create_if_block$7(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t1_value = (/*$user*/ ctx[0].usernam ?? /*$user*/ ctx[0].githubId) + "";
    	let t1;
    	let t2;
    	let button;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			p = element("p");
    			p.textContent = "Edit profile";
    			if (!src_url_equal(img.src, img_src_value = /*$user*/ ctx[0].profileImg || GIT_URL + '/' + /*$user*/ ctx[0].githubId + '.png')) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "profile__img svelte-gid2k0");
    			add_location(img, file$h, 15, 2, 298);
    			attr_dev(div, "class", "profile__id svelte-gid2k0");
    			add_location(div, file$h, 16, 2, 405);
    			add_location(p, file$h, 18, 3, 531);
    			attr_dev(button, "class", "edit_btn svelte-gid2k0");
    			add_location(button, file$h, 17, 2, 472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, p);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onClickEditProfile*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$user*/ 1 && !src_url_equal(img.src, img_src_value = /*$user*/ ctx[0].profileImg || GIT_URL + '/' + /*$user*/ ctx[0].githubId + '.png')) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$user*/ 1 && t1_value !== (t1_value = (/*$user*/ ctx[0].usernam ?? /*$user*/ ctx[0].githubId) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(15:1) {#if $user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[0]) return create_if_block$7;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "profile svelte-gid2k0");
    			add_location(div, file$h, 13, 0, 261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
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
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);

    	function onClickEditProfile() {
    		push$1('/edit_profile');
    	}

    	function onClickLogin() {
    		push$1('/login');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		user,
    		GIT_URL,
    		push: push$1,
    		onClickEditProfile,
    		onClickLogin,
    		$user
    	});

    	return [$user, onClickEditProfile, onClickLogin];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/Grass.svelte generated by Svelte v3.46.3 */

    const file$g = "src/components/Grass.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (24:0) {:else}
    function create_else_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "불러오는 중입니다.";
    			add_location(p, file$g, 24, 1, 566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(24:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#if grass_list}
    function create_if_block$6(ctx) {
    	let div;
    	let div_class_value;
    	let each_value = /*grass_list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "box " + (/*isBig*/ ctx[1] ? "big_box" : "grass_box") + " svelte-197ht8d");
    			add_location(div, file$g, 7, 0, 124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Math, grass_list, color_level, group_num, isBig*/ 15) {
    				each_value = /*grass_list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isBig*/ 2 && div_class_value !== (div_class_value = "box " + (/*isBig*/ ctx[1] ? "big_box" : "grass_box") + " svelte-197ht8d")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(7:0) {#if grass_list}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {:else}
    function create_else_block$6(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*grass*/ ctx[4].count < 9) return create_if_block_2$2;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_2(ctx);
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
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if isBig}
    function create_if_block_1$6(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count * /*color_level*/ ctx[3] / /*group_num*/ ctx[2]) + " svelte-197ht8d");
    			add_location(div, file$g, 11, 3, 242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grass_list, group_num*/ 5 && div_class_value !== (div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count * /*color_level*/ ctx[3] / /*group_num*/ ctx[2]) + " svelte-197ht8d")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(10:2) {#if isBig}",
    		ctx
    	});

    	return block;
    }

    // (17:3) {:else}
    function create_else_block_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "grass grass_4 svelte-197ht8d");
    			add_location(div, file$g, 18, 4, 494);
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
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(17:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:3) {#if grass.count < 9}
    function create_if_block_2$2(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count / 2) + " svelte-197ht8d");
    			add_location(div, file$g, 15, 4, 381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grass_list*/ 1 && div_class_value !== (div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count / 2) + " svelte-197ht8d")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(15:3) {#if grass.count < 9}",
    		ctx
    	});

    	return block;
    }

    // (9:1) {#each grass_list as grass}
    function create_each_block$9(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*isBig*/ ctx[1]) return create_if_block_1$6;
    		return create_else_block$6;
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
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(9:1) {#each grass_list as grass}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*grass_list*/ ctx[0]) return create_if_block$6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { grass_list: 0, isBig: 1, group_num: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grass",
    			options,
    			id: create_fragment$h.name
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

    const timeout=1500;

    function createNotificationStore () {
        const _notifications = writable([]);
        
        function send (message) {
            _notifications.update(state => {
                return [...state, { id: id(), message, timeout }]
            });
        }
        function reset(){
            _notifications.update(state=>[]);
        }
        function remove(index){
            _notifications.update(state=>{
                state.splice(index,1);
                return state
            });
        }

        const notifications = derived(_notifications, ($_notifications, set) => {
            set($_notifications);
            if ($_notifications.length > 0) {
                const timer = setTimeout(() => {
                    _notifications.update(state => {
                        state.shift();
                        return state
                    });
                }, $_notifications[0].timeout);
                return () => {
                    clearTimeout(timer);
                }
            }
        });
        const { subscribe } = notifications;

        return {
            subscribe,
            send,
            reset,
            remove,
        }
    }

    function id() {
        return '_' + Math.random().toString(36).substring(2,9);
    }
    const notifications = createNotificationStore();

    const initialState = [];

    let challengeList = writable(initialState);
    let totalPages=writable(0);

    async function getChallenge( id ) {
    	let res = await fetchGet(`challenges/${id}`);
    	if(res.error) {
    		// TODO: api 연결된 후에는 에러처리 하기
    		res = {name: 'API 연결해죠', description: 'API 연결행', isPrivate: true };
    	}
    	return res;
    }

    async function getAllChallenge(page, size) {

    	const res = await fetchGet('challenges?'+ new URLSearchParams({
    		page: page,
    		size: size,
    	}));

        if(res.error)
            failGetChallenge();
        else {	
            challengeList.set(res.content);
            totalPages.set(res.totalPages); 

        }
    }

    function failGetChallenge(){
        notifications.send("불러오기 실패!  다시 시도해주세요!");
    }

    async function joinChallenge(challenge_id) {
    	const res = await fetchPost(`challenges/${challenge_id}/join`);
    	return res;
    }

    const getApproveList = async(params) => {
    	const res = await fetchGet('challenges/join?' + new URLSearchParams({
    		...params
    	}));
    	return res;
    };

    const approveJoin = async(params) => {
    	const res = await fetchPost('challenges/join/approve?' + new URLSearchParams({
    		...params
    	}));
    	return res;
    };

    const rejectJoin = async(params) => {
    	const res = await fetchPost('challenges/join/reject?' + new URLSearchParams({
    		...params
    	}));
    	return res;
    };

    const editChallenge = async(id, body) => {
    	const res = await fetchPatch(`challenges/${id}`, body);
    	return res;
    };

    const deleteChallenge = async(id) => {
    	const res = await fetchDelete(`challenges/${id}`);
    	return res;
    };

    async function getGrass( id ) {
    	const url = `https://2hefmq4b0a.execute-api.ap-northeast-2.amazonaws.com/crawlingGithub?${id}`;
    	const options = {
    		method: 'GET',
    	};
    	const res = await fetch(url, options);
    	const data = await res.json();
    	return data;
    }

    /* src/pages/Home.svelte generated by Svelte v3.46.3 */
    const file$f = "src/pages/Home.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (33:4) {#each $challengeList as challenge}
    function create_each_block$8(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*challenge*/ ctx[4].title + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*challenge*/ ctx[4].description + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*challenge*/ ctx[4]);
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
    			attr_dev(div0, "class", "box_title svelte-x06cgc");
    			add_location(div0, file$f, 34, 6, 1083);
    			attr_dev(div1, "class", "box_intro svelte-x06cgc");
    			add_location(div1, file$f, 35, 6, 1188);
    			attr_dev(div2, "class", "challenge_box svelte-x06cgc");
    			add_location(div2, file$f, 33, 5, 1049);
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
    			if (dirty & /*$challengeList*/ 2 && t0_value !== (t0_value = /*challenge*/ ctx[4].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$challengeList*/ 2 && t2_value !== (t2_value = /*challenge*/ ctx[4].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(33:4) {#each $challengeList as challenge}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    	let each_value = /*$challengeList*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
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
    			attr_dev(div0, "class", "content_title svelte-x06cgc");
    			add_location(div0, file$f, 30, 3, 931);
    			attr_dev(div1, "class", "box_container svelte-x06cgc");
    			add_location(div1, file$f, 31, 3, 976);
    			attr_dev(div2, "class", "pinned");
    			add_location(div2, file$f, 29, 2, 907);
    			attr_dev(div3, "class", "content_title svelte-x06cgc");
    			add_location(div3, file$f, 41, 3, 1309);
    			attr_dev(div4, "class", "grass");
    			add_location(div4, file$f, 40, 2, 1286);
    			attr_dev(div5, "class", "content svelte-x06cgc");
    			add_location(div5, file$f, 28, 1, 883);
    			attr_dev(div6, "class", "overview svelte-x06cgc");
    			add_location(div6, file$f, 26, 0, 846);
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
    			if (dirty & /*$challengeList, push*/ 2) {
    				each_value = /*$challengeList*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $user;
    	let $challengeList;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	validate_store(challengeList, 'challengeList');
    	component_subscribe($$self, challengeList, $$value => $$invalidate(1, $challengeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let grass_list = null;

    	// TODO: 유저별로 home을 만들지 자기 home만 보이게 할 것인지 회의 필요
    	onMount(async () => {
    		changeTab(0);

    		if (!$user) {
    			if (localStorage.getItem(ACCESS_TOKEN)) await getUser(); else push$1('/login');
    		}

    		$$invalidate(0, grass_list = await getGrass($user?.githubId));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = challenge => {
    		push$1(`/challenge/${challenge.id}`);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		push: push$1,
    		onMount,
    		beforeUpdate,
    		afterUpdate,
    		GlobalNavigationBar,
    		Profile,
    		Grass,
    		user,
    		getUser,
    		changeTab,
    		challengeList,
    		ACCESS_TOKEN,
    		getGrass,
    		grass_list,
    		$user,
    		$challengeList
    	});

    	$$self.$inject_state = $$props => {
    		if ('grass_list' in $$props) $$invalidate(0, grass_list = $$props.grass_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [grass_list, $challengeList, click_handler];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/pages/Login.svelte generated by Svelte v3.46.3 */
    const file$e = "src/pages/Login.svelte";

    // (8:1) <Button   width='15rem'   height='2.5rem'   backgroundColor='var(--main-white-color)'   onClick={login}  >
    function create_default_slot$b(ctx) {
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
    			attr_dev(img, "class", "Login__icon svelte-14uycgs");
    			if (!src_url_equal(img.src, img_src_value = "images/github.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "gitIcon");
    			add_location(img, file$e, 14, 3, 329);
    			add_location(span0, file$e, 15, 3, 398);
    			attr_dev(span1, "class", "Login__slot svelte-14uycgs");
    			add_location(span1, file$e, 13, 2, 299);
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
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(8:1) <Button   width='15rem'   height='2.5rem'   backgroundColor='var(--main-white-color)'   onClick={login}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
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
    				onClick: login,
    				$$slots: { default: [create_default_slot$b] },
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
    			attr_dev(img, "class", "Login__logo svelte-14uycgs");
    			if (!src_url_equal(img.src, img_src_value = "images/grabit_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$e, 6, 1, 121);
    			attr_dev(div, "class", "Login svelte-14uycgs");
    			add_location(div, file$e, 5, 0, 100);
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

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ login, Button });
    	return [];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/components/Toast.svelte generated by Svelte v3.46.3 */
    const file$d = "src/components/Toast.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (13:4) {#each $notifications as notification, index (notification.id)}
    function create_each_block$7(key_1, ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*notification*/ ctx[2].message + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div1_intro;
    	let div1_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*index*/ ctx[4]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			attr_dev(div0, "class", "notifications__toast__message svelte-ofcv3b");
    			add_location(div0, file$d, 19, 12, 562);
    			attr_dev(img, "class", "notifications__toast__button svelte-ofcv3b");
    			if (!src_url_equal(img.src, img_src_value = "images/x-mark.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "x-mark");
    			add_location(img, file$d, 20, 12, 646);
    			attr_dev(div1, "class", "notifications__toast svelte-ofcv3b");
    			add_location(div1, file$d, 13, 8, 370);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(div1, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$notifications*/ 1) && t0_value !== (t0_value = /*notification*/ ctx[2].message + "")) set_data_dev(t0, t0_value);
    		},
    		r: function measure() {
    			rect = div1.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div1);
    			stop_animation();
    			add_transform(div1, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div1, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fly, { x: 100, duration: 1000 });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fly, { x: 100, duration: 100 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(13:4) {#each $notifications as notification, index (notification.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$notifications*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*notification*/ ctx[2].id;
    	validate_each_keys(ctx, each_value, get_each_context$7, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "notifications svelte-ofcv3b");
    			add_location(div, file$d, 11, 0, 266);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*notifications, $notifications*/ 1) {
    				each_value = /*$notifications*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$7, null, get_each_context$7);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
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
    	let $notifications;
    	validate_store(notifications, 'notifications');
    	component_subscribe($$self, notifications, $$value => $$invalidate(0, $notifications = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toast', slots, []);

    	onMount(() => {
    		notifications.reset();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toast> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => notifications.remove(index);

    	$$self.$capture_state = () => ({
    		onMount,
    		flip,
    		fly,
    		notifications,
    		$notifications
    	});

    	return [$notifications, click_handler];
    }

    class Toast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toast",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/SettingChallenge.svelte generated by Svelte v3.46.3 */

    const file$c = "src/components/SettingChallenge.svelte";

    // (42:0) {#if isActive}
    function create_if_block$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*challengeData*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(42:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (45:1) {:else}
    function create_else_block$5(ctx) {
    	let toast;
    	let t0;
    	let div15;
    	let div14;
    	let div0;
    	let t2;
    	let div3;
    	let div1;
    	let t4;
    	let span;
    	let input0;
    	let updating_bindvalue;
    	let t5;
    	let div2;
    	let t7;
    	let input1;
    	let updating_bindvalue_1;
    	let t8;
    	let hr0;
    	let t9;
    	let div12;
    	let div7;
    	let input2;
    	let t10;
    	let img0;
    	let img0_src_value;
    	let t11;
    	let div6;
    	let div4;
    	let t13;
    	let div5;
    	let t15;
    	let div11;
    	let input3;
    	let t16;
    	let img1;
    	let img1_src_value;
    	let t17;
    	let div10;
    	let div8;
    	let t19;
    	let div9;
    	let t21;
    	let hr1;
    	let t22;
    	let div13;
    	let button0;
    	let t23;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	toast = new Toast({ $$inline: true });

    	function input0_bindvalue_binding(value) {
    		/*input0_bindvalue_binding*/ ctx[8](value);
    	}

    	let input0_props = { maxlength: "20", size: "20" };

    	if (/*name*/ ctx[2] !== void 0) {
    		input0_props.bindvalue = /*name*/ ctx[2];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'bindvalue', input0_bindvalue_binding));

    	function input1_bindvalue_binding(value) {
    		/*input1_bindvalue_binding*/ ctx[9](value);
    	}

    	let input1_props = { size: "70" };

    	if (/*description*/ ctx[3] !== void 0) {
    		input1_props.bindvalue = /*description*/ ctx[3];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'bindvalue', input1_bindvalue_binding));

    	button0 = new Button({
    			props: {
    				width: "8rem",
    				height: "2.5rem",
    				backgroundColor: "var(--main-green-color)",
    				onClick: /*onClickSave*/ ctx[5],
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "8rem",
    				height: "2.5rem",
    				backgroundColor: "#FAE5E5",
    				onClick: /*onClickDelete*/ ctx[6],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toast.$$.fragment);
    			t0 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div0 = element("div");
    			div0.textContent = "Settings";
    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Challenge name";
    			t4 = space();
    			span = element("span");
    			create_component(input0.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "Description";
    			t7 = space();
    			create_component(input1.$$.fragment);
    			t8 = space();
    			hr0 = element("hr");
    			t9 = space();
    			div12 = element("div");
    			div7 = element("div");
    			input2 = element("input");
    			t10 = space();
    			img0 = element("img");
    			t11 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Public";
    			t13 = space();
    			div5 = element("div");
    			div5.textContent = "Anyone on the internet can see this Challenge!";
    			t15 = space();
    			div11 = element("div");
    			input3 = element("input");
    			t16 = space();
    			img1 = element("img");
    			t17 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div8.textContent = "Private";
    			t19 = space();
    			div9 = element("div");
    			div9.textContent = "You choose who can see and join to this Challenge!";
    			t21 = space();
    			hr1 = element("hr");
    			t22 = space();
    			div13 = element("div");
    			create_component(button0.$$.fragment);
    			t23 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div0, "class", "title svelte-1j99ca0");
    			add_location(div0, file$c, 48, 4, 1181);
    			attr_dev(div1, "class", "text svelte-1j99ca0");
    			add_location(div1, file$c, 50, 5, 1246);
    			add_location(span, file$c, 51, 5, 1288);
    			attr_dev(div2, "class", "text svelte-1j99ca0");
    			add_location(div2, file$c, 55, 5, 1377);
    			attr_dev(div3, "class", "sub_content svelte-1j99ca0");
    			add_location(div3, file$c, 49, 4, 1217);
    			attr_dev(hr0, "align", "left");
    			attr_dev(hr0, "class", "hr svelte-1j99ca0");
    			add_location(hr0, file$c, 59, 4, 1478);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "secure");
    			input2.__value = "public";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input2);
    			add_location(input2, file$c, 62, 6, 1564);
    			attr_dev(img0, "class", "image svelte-1j99ca0");
    			if (!src_url_equal(img0.src, img0_src_value = "images/public.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "public_img");
    			add_location(img0, file$c, 63, 6, 1640);
    			attr_dev(div4, "class", "small_text svelte-1j99ca0");
    			add_location(div4, file$c, 65, 7, 1722);
    			attr_dev(div5, "class", "explain_text svelte-1j99ca0");
    			add_location(div5, file$c, 66, 7, 1764);
    			add_location(div6, file$c, 64, 6, 1709);
    			attr_dev(div7, "class", "contain svelte-1j99ca0");
    			add_location(div7, file$c, 61, 5, 1538);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "secure");
    			attr_dev(input3, "align", "middle");
    			input3.__value = "private";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input3);
    			add_location(input3, file$c, 71, 6, 1898);
    			attr_dev(img1, "class", "image svelte-1j99ca0");
    			if (!src_url_equal(img1.src, img1_src_value = "images/private.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "private_img");
    			add_location(img1, file$c, 72, 6, 1990);
    			attr_dev(div8, "class", "small_text svelte-1j99ca0");
    			add_location(div8, file$c, 74, 7, 2074);
    			attr_dev(div9, "class", "explain_text svelte-1j99ca0");
    			add_location(div9, file$c, 75, 7, 2117);
    			add_location(div10, file$c, 73, 6, 2061);
    			attr_dev(div11, "class", "contain svelte-1j99ca0");
    			add_location(div11, file$c, 70, 5, 1872);
    			attr_dev(div12, "class", "sub_content svelte-1j99ca0");
    			add_location(div12, file$c, 60, 4, 1509);
    			attr_dev(hr1, "align", "left");
    			attr_dev(hr1, "class", "hr svelte-1j99ca0");
    			add_location(hr1, file$c, 79, 4, 2238);
    			attr_dev(div13, "class", "sub_content button_group svelte-1j99ca0");
    			add_location(div13, file$c, 80, 4, 2269);
    			attr_dev(div14, "class", "content svelte-1j99ca0");
    			add_location(div14, file$c, 47, 3, 1155);
    			attr_dev(div15, "class", "page svelte-1j99ca0");
    			add_location(div15, file$c, 46, 2, 1133);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toast, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div14);
    			append_dev(div14, div0);
    			append_dev(div14, t2);
    			append_dev(div14, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t4);
    			append_dev(div3, span);
    			mount_component(input0, span, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div3, t7);
    			mount_component(input1, div3, null);
    			append_dev(div14, t8);
    			append_dev(div14, hr0);
    			append_dev(div14, t9);
    			append_dev(div14, div12);
    			append_dev(div12, div7);
    			append_dev(div7, input2);
    			input2.checked = input2.__value === /*secure*/ ctx[4];
    			append_dev(div7, t10);
    			append_dev(div7, img0);
    			append_dev(div7, t11);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div12, t15);
    			append_dev(div12, div11);
    			append_dev(div11, input3);
    			input3.checked = input3.__value === /*secure*/ ctx[4];
    			append_dev(div11, t16);
    			append_dev(div11, img1);
    			append_dev(div11, t17);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t19);
    			append_dev(div10, div9);
    			append_dev(div14, t21);
    			append_dev(div14, hr1);
    			append_dev(div14, t22);
    			append_dev(div14, div13);
    			mount_component(button0, div13, null);
    			append_dev(div13, t23);
    			mount_component(button1, div13, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[10]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_bindvalue && dirty & /*name*/ 4) {
    				updating_bindvalue = true;
    				input0_changes.bindvalue = /*name*/ ctx[2];
    				add_flush_callback(() => updating_bindvalue = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_bindvalue_1 && dirty & /*description*/ 8) {
    				updating_bindvalue_1 = true;
    				input1_changes.bindvalue = /*description*/ ctx[3];
    				add_flush_callback(() => updating_bindvalue_1 = false);
    			}

    			input1.$set(input1_changes);

    			if (dirty & /*secure*/ 16) {
    				input2.checked = input2.__value === /*secure*/ ctx[4];
    			}

    			if (dirty & /*secure*/ 16) {
    				input3.checked = input3.__value === /*secure*/ ctx[4];
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toast.$$.fragment, local);
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toast.$$.fragment, local);
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toast, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div15);
    			destroy_component(input0);
    			destroy_component(input1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[11][0].splice(/*$$binding_groups*/ ctx[11][0].indexOf(input3), 1);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(45:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:1) {#if !challengeData}
    function create_if_block_1$5(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(43:1) {#if !challengeData}",
    		ctx
    	});

    	return block;
    }

    // (82:5) <Button        width='8rem'       height='2.5rem'       backgroundColor='var(--main-green-color)'       onClick={onClickSave}      >
    function create_default_slot_1$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Save";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$c, 87, 6, 2453);
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
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(82:5) <Button        width='8rem'       height='2.5rem'       backgroundColor='var(--main-green-color)'       onClick={onClickSave}      >",
    		ctx
    	});

    	return block;
    }

    // (91:5) <Button        width='8rem'       height='2.5rem'       backgroundColor='#FAE5E5'       onClick={onClickDelete}      >
    function create_default_slot$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Delete";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$c, 96, 6, 2634);
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
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(91:5) <Button        width='8rem'       height='2.5rem'       backgroundColor='#FAE5E5'       onClick={onClickDelete}      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isActive*/ ctx[0] && create_if_block$5(ctx);

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
    			if (/*isActive*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SettingChallenge', slots, []);
    	let { isActive } = $$props;
    	let { params } = $$props;
    	let challengeData = null;
    	let name = '';
    	let description = '';
    	let secure = "public";
    	let leader = '';

    	onMount(async () => {
    		$$invalidate(1, challengeData = await getChallenge(params.id));
    		$$invalidate(2, name = challengeData.name);
    		$$invalidate(3, description = challengeData.description);
    		leader = challengeData.leader;
    		$$invalidate(4, secure = challengeData.isPrivate ? 'private' : 'public');
    	});

    	const onClickSave = () => {
    		const isPrivate = secure === 'private';

    		editChallenge(params.id, { name, description, isPrivate, leader }).then(() => {
    			notifications.send('저장되었습니다.');
    		});
    	};

    	const onClickDelete = () => {
    		deleteChallenge(params.id).then(() => {
    			notifications.send('삭제되었습니다.');
    		});
    	};

    	const writable_props = ['isActive', 'params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SettingChallenge> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_bindvalue_binding(value) {
    		name = value;
    		$$invalidate(2, name);
    	}

    	function input1_bindvalue_binding(value) {
    		description = value;
    		$$invalidate(3, description);
    	}

    	function input2_change_handler() {
    		secure = this.__value;
    		$$invalidate(4, secure);
    	}

    	function input3_change_handler() {
    		secure = this.__value;
    		$$invalidate(4, secure);
    	}

    	$$self.$$set = $$props => {
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    		if ('params' in $$props) $$invalidate(7, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		push: push$1,
    		pop,
    		Button,
    		Input,
    		Loader,
    		notifications,
    		Toast,
    		getChallenge,
    		editChallenge,
    		deleteChallenge,
    		isActive,
    		params,
    		challengeData,
    		name,
    		description,
    		secure,
    		leader,
    		onClickSave,
    		onClickDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    		if ('params' in $$props) $$invalidate(7, params = $$props.params);
    		if ('challengeData' in $$props) $$invalidate(1, challengeData = $$props.challengeData);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('secure' in $$props) $$invalidate(4, secure = $$props.secure);
    		if ('leader' in $$props) leader = $$props.leader;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isActive,
    		challengeData,
    		name,
    		description,
    		secure,
    		onClickSave,
    		onClickDelete,
    		params,
    		input0_bindvalue_binding,
    		input1_bindvalue_binding,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler
    	];
    }

    class SettingChallenge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { isActive: 0, params: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingChallenge",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isActive*/ ctx[0] === undefined && !('isActive' in props)) {
    			console.warn("<SettingChallenge> was created without expected prop 'isActive'");
    		}

    		if (/*params*/ ctx[7] === undefined && !('params' in props)) {
    			console.warn("<SettingChallenge> was created without expected prop 'params'");
    		}
    	}

    	get isActive() {
    		throw new Error("<SettingChallenge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<SettingChallenge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<SettingChallenge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<SettingChallenge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ApproveMember.svelte generated by Svelte v3.46.3 */
    const file$b = "src/components/ApproveMember.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (26:0) {#if isActive}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*CardList*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(26:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (29:1) {:else}
    function create_else_block$4(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let each_value = /*CardList*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "Card__list svelte-1a12pbs");
    			add_location(div0, file$b, 30, 3, 684);
    			attr_dev(div1, "class", "Card svelte-1a12pbs");
    			add_location(div1, file$b, 29, 2, 662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*onClickReject, CardList, onClickApprove, GIT_URL*/ 14) {
    				each_value = /*CardList*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(29:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:1) {#if !CardList}
    function create_if_block_1$4(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(27:1) {#if !CardList}",
    		ctx
    	});

    	return block;
    }

    // (45:8) <Button          width='2rem'          height='2rem'          backgroundColor='var(--main-green-color)'          style='padding: 0;'          onClick={onClickApprove(card.id)}         >
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "Card__button__image svelte-1a12pbs");
    			attr_dev(img, "alt", "Check");
    			add_location(img, file$b, 51, 9, 1311);
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(45:8) <Button          width='2rem'          height='2rem'          backgroundColor='var(--main-green-color)'          style='padding: 0;'          onClick={onClickApprove(card.id)}         >",
    		ctx
    	});

    	return block;
    }

    // (54:8) <Button          width='2rem'          height='2rem'          backgroundColor='#FAE5E5'          style='padding: 0;'          onClick={onClickReject(card.id)}         >
    function create_default_slot_1$6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/x.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "Card__button__image svelte-1a12pbs");
    			attr_dev(img, "alt", "Reject");
    			add_location(img, file$b, 60, 9, 1584);
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
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(54:8) <Button          width='2rem'          height='2rem'          backgroundColor='#FAE5E5'          style='padding: 0;'          onClick={onClickReject(card.id)}         >",
    		ctx
    	});

    	return block;
    }

    // (33:5) <Card>
    function create_default_slot$9(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h3;
    	let t1_value = /*card*/ ctx[5].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*card*/ ctx[5].message + "";
    	let t3;
    	let t4;
    	let div1;
    	let button0;
    	let t5;
    	let button1;
    	let t6;
    	let current;

    	button0 = new Button({
    			props: {
    				width: "2rem",
    				height: "2rem",
    				backgroundColor: "var(--main-green-color)",
    				style: "padding: 0;",
    				onClick: /*onClickApprove*/ ctx[2](/*card*/ ctx[5].id),
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "2rem",
    				height: "2rem",
    				backgroundColor: "#FAE5E5",
    				style: "padding: 0;",
    				onClick: /*onClickReject*/ ctx[3](/*card*/ ctx[5].id),
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			create_component(button0.$$.fragment);
    			t5 = space();
    			create_component(button1.$$.fragment);
    			t6 = space();
    			if (!src_url_equal(img.src, img_src_value = "" + (GIT_URL + "/" + /*card*/ ctx[5].name + ".png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "Card__profile svelte-1a12pbs");
    			add_location(img, file$b, 34, 7, 788);
    			attr_dev(h3, "class", "Card__body__head Card__body--ellipsis svelte-1a12pbs");
    			add_location(h3, file$b, 36, 8, 917);
    			attr_dev(p, "class", "Card__body--ellipsis svelte-1a12pbs");
    			add_location(p, file$b, 39, 8, 1011);
    			attr_dev(div0, "class", "Card__body__content svelte-1a12pbs");
    			add_location(div0, file$b, 35, 7, 875);
    			add_location(div1, file$b, 43, 7, 1102);
    			attr_dev(div2, "class", "Card__body svelte-1a12pbs");
    			add_location(div2, file$b, 33, 6, 756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			mount_component(button0, div1, null);
    			append_dev(div1, t5);
    			mount_component(button1, div1, null);
    			insert_dev(target, t6, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*CardList*/ 2 && !src_url_equal(img.src, img_src_value = "" + (GIT_URL + "/" + /*card*/ ctx[5].name + ".png"))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*CardList*/ 2) && t1_value !== (t1_value = /*card*/ ctx[5].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*CardList*/ 2) && t3_value !== (t3_value = /*card*/ ctx[5].message + "")) set_data_dev(t3, t3_value);
    			const button0_changes = {};
    			if (dirty & /*CardList*/ 2) button0_changes.onClick = /*onClickApprove*/ ctx[2](/*card*/ ctx[5].id);

    			if (dirty & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*CardList*/ 2) button1_changes.onClick = /*onClickReject*/ ctx[3](/*card*/ ctx[5].id);

    			if (dirty & /*$$scope*/ 256) {
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
    			if (detaching) detach_dev(div2);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(33:5) <Card>",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#each CardList as card}
    function create_each_block$6(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, CardList*/ 258) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(32:4) {#each CardList as card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isActive*/ ctx[0] && create_if_block$4(ctx);

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
    			if (/*isActive*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 1) {
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ApproveMember', slots, []);
    	let { params } = $$props;
    	let { isActive } = $$props;
    	let CardList;

    	onMount(() => {
    		$$invalidate(1, CardList = getApproveList({ challengeId: params.id }));
    	});

    	const onClickApprove = requestId => {
    		// TODO: API정상 작동하면 요청완료된 requeset 필터시켜버리기
    		approveJoin(requestId);
    	};

    	const onClickReject = requestId => {
    		// TODO: API정상 작동하면 요청완료된 requeset 필터시켜버리기
    		rejectJoin(requestId);
    	};

    	const writable_props = ['params', 'isActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApproveMember> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Card,
    		Loader,
    		Button,
    		getApproveList,
    		approveJoin,
    		rejectJoin,
    		GIT_URL,
    		params,
    		isActive,
    		CardList,
    		onClickApprove,
    		onClickReject
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    		if ('CardList' in $$props) $$invalidate(1, CardList = $$props.CardList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isActive, CardList, onClickApprove, onClickReject, params];
    }

    class ApproveMember extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { params: 4, isActive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApproveMember",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[4] === undefined && !('params' in props)) {
    			console.warn("<ApproveMember> was created without expected prop 'params'");
    		}

    		if (/*isActive*/ ctx[0] === undefined && !('isActive' in props)) {
    			console.warn("<ApproveMember> was created without expected prop 'isActive'");
    		}
    	}

    	get params() {
    		throw new Error("<ApproveMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ApproveMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isActive() {
    		throw new Error("<ApproveMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<ApproveMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Setting.svelte generated by Svelte v3.46.3 */
    const file$a = "src/pages/Setting.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (25:3) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>
    function create_default_slot_1$5(ctx) {
    	let t_value = /*item*/ ctx[10] + "";
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(25:3) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#each tabItem as item, index}
    function create_each_block_1$1(ctx) {
    	let subnavitem;
    	let current;

    	function func() {
    		return /*func*/ ctx[5](/*index*/ ctx[9]);
    	}

    	subnavitem = new SubNavigationItem({
    			props: {
    				onClick: func,
    				isActive: /*activeItem*/ ctx[1] === /*index*/ ctx[9],
    				$$slots: { default: [create_default_slot_1$5] },
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
    			if (dirty & /*activeItem*/ 2) subnavitem_changes.isActive = /*activeItem*/ ctx[1] === /*index*/ ctx[9];

    			if (dirty & /*$$scope*/ 4096) {
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(24:2) {#each tabItem as item, index}",
    		ctx
    	});

    	return block;
    }

    // (23:1) <SubNav>
    function create_default_slot$8(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*tabItem*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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
    			if (dirty & /*onClickItem, activeItem, tabItem*/ 22) {
    				each_value_1 = /*tabItem*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(23:1) <SubNav>",
    		ctx
    	});

    	return block;
    }

    // (28:1) {#each settingSubComponent as SubComp, index}
    function create_each_block$5(ctx) {
    	let subcomp;
    	let current;

    	subcomp = new /*SubComp*/ ctx[7]({
    			props: {
    				isActive: /*activeItem*/ ctx[1] === /*index*/ ctx[9],
    				params: /*params*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(subcomp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(subcomp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const subcomp_changes = {};
    			if (dirty & /*activeItem*/ 2) subcomp_changes.isActive = /*activeItem*/ ctx[1] === /*index*/ ctx[9];
    			if (dirty & /*params*/ 1) subcomp_changes.params = /*params*/ ctx[0];
    			subcomp.$set(subcomp_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(subcomp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(subcomp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(subcomp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(28:1) {#each settingSubComponent as SubComp, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div;
    	let subnav;
    	let t1;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });

    	subnav = new SubNavigation({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*settingSubComponent*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(subnav.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "Setting svelte-1lh4n8u");
    			add_location(div, file$a, 21, 0, 616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(subnav, div, null);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const subnav_changes = {};

    			if (dirty & /*$$scope, activeItem*/ 4098) {
    				subnav_changes.$$scope = { dirty, ctx };
    			}

    			subnav.$set(subnav_changes);

    			if (dirty & /*activeItem, params*/ 3) {
    				each_value = /*settingSubComponent*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
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
    			transition_in(subnav.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(subnav.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(subnav);
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
    	validate_slots('Setting', slots, []);
    	let { params = {} } = $$props;
    	const tabItem = ['설정', '참여 승인'];
    	const settingSubComponent = [SettingChallenge, ApproveMember];
    	let activeItem = 0;

    	function onClickItem(i) {
    		$$invalidate(1, activeItem = i);
    	}

    	function setActive(i) {
    		if (i === activeItem) return true;
    		return false;
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Setting> was created with unknown prop '${key}'`);
    	});

    	const func = index => onClickItem(index);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		GlobalNavigationBar,
    		SubNav: SubNavigation,
    		SubNavItem: SubNavigationItem,
    		SettingChallenge,
    		ApproveMember,
    		params,
    		tabItem,
    		settingSubComponent,
    		activeItem,
    		onClickItem,
    		setActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, activeItem, tabItem, settingSubComponent, onClickItem, func];
    }

    class Setting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Setting",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get params() {
    		throw new Error("<Setting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Setting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/CommitRequest.svelte generated by Svelte v3.46.3 */
    const file$9 = "src/components/CommitRequest.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (17:6) <Button        width='5rem'        height='2rem'        backgroundColor='#B8FFC8'       >
    function create_default_slot_1$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "승인";
    			attr_dev(div, "class", "btn_txt svelte-2z0tw0");
    			add_location(div, file$9, 21, 7, 571);
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(17:6) <Button        width='5rem'        height='2rem'        backgroundColor='#B8FFC8'       >",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Button        width='5rem'        height='2rem'        backgroundColor='#FFB8B4'       >
    function create_default_slot$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "반려";
    			attr_dev(div, "class", "btn_txt svelte-2z0tw0");
    			add_location(div, file$9, 29, 7, 781);
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(25:6) <Button        width='5rem'        height='2rem'        backgroundColor='#FFB8B4'       >",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each req_list as req}
    function create_each_block$4(ctx) {
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
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#FFB8B4",
    				$$slots: { default: [create_default_slot$7] },
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
    			attr_dev(div0, "class", "req_box_desc svelte-2z0tw0");
    			add_location(div0, file$9, 11, 4, 250);
    			attr_dev(div1, "class", "req_box_requester svelte-2z0tw0");
    			add_location(div1, file$9, 12, 4, 297);
    			attr_dev(div2, "class", "approver svelte-2z0tw0");
    			add_location(div2, file$9, 14, 5, 385);
    			set_style(span, "display", "inline-block");
    			set_style(span, "width", "0.05rem");
    			add_location(span, file$9, 23, 6, 623);
    			add_location(div3, file$9, 15, 5, 462);
    			attr_dev(div4, "class", "req_box_btn svelte-2z0tw0");
    			add_location(div4, file$9, 13, 4, 354);
    			attr_dev(div5, "class", "req_box svelte-2z0tw0");
    			add_location(div5, file$9, 10, 3, 224);
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(10:2) {#each req_list as req}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*req_list*/ ctx[1];
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
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "현재 올라온 요청";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "title svelte-2z0tw0");
    			add_location(p, file$9, 7, 1, 135);
    			attr_dev(div0, "class", "admit_req_box svelte-2z0tw0");
    			add_location(div0, file$9, 8, 1, 167);
    			attr_dev(div1, "class", "admit_req svelte-2z0tw0");
    			add_location(div1, file$9, 6, 0, 110);
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { group: 0, req_list: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommitRequest",
    			options,
    			id: create_fragment$a.name
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

    /* src/pages/ChallengeDetail.svelte generated by Svelte v3.46.3 */
    const file$8 = "src/pages/ChallengeDetail.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (81:0) {:else}
    function create_else_block$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0_value = /*challenge*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*challenge*/ ctx[1].description + "";
    	let t2;
    	let t3;
    	let show_if = !/*challenge*/ ctx[1].member.includes(/*$user*/ ctx[4].githubId);
    	let t4;
    	let div7;
    	let div4;
    	let p;
    	let t6;
    	let grass;
    	let t7;
    	let div6;
    	let div5;
    	let t8;
    	let commitrequest;
    	let current;
    	let if_block = show_if && create_if_block_2$1(ctx);

    	grass = new Grass({
    			props: {
    				grass_list: /*grass_team*/ ctx[3],
    				isBig: true,
    				group_num: /*challenge*/ ctx[1].member.length
    			},
    			$$inline: true
    		});

    	let each_value = /*challenge*/ ctx[1].member;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	commitrequest = new CommitRequest({
    			props: {
    				group: /*challenge*/ ctx[1].member,
    				req_list: /*req_list*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div7 = element("div");
    			div4 = element("div");
    			p = element("p");
    			p.textContent = "Team의 잔디";
    			t6 = space();
    			create_component(grass.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			create_component(commitrequest.$$.fragment);
    			attr_dev(div0, "class", "upper_title svelte-1dwvoh5");
    			add_location(div0, file$8, 83, 3, 2394);
    			attr_dev(div1, "class", "upper_description svelte-1dwvoh5");
    			add_location(div1, file$8, 84, 3, 2445);
    			attr_dev(div2, "class", "title_desc");
    			add_location(div2, file$8, 82, 2, 2366);
    			attr_dev(div3, "class", "upper svelte-1dwvoh5");
    			add_location(div3, file$8, 81, 1, 2344);
    			attr_dev(p, "class", "grass_title svelte-1dwvoh5");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "font-size", "1.1rem");
    			add_location(p, file$8, 101, 3, 2835);
    			attr_dev(div4, "class", "team_grass svelte-1dwvoh5");
    			add_location(div4, file$8, 100, 2, 2807);
    			attr_dev(div5, "class", "personal svelte-1dwvoh5");
    			add_location(div5, file$8, 111, 3, 3066);
    			attr_dev(div6, "class", "personal_admit svelte-1dwvoh5");
    			add_location(div6, file$8, 110, 2, 3034);
    			attr_dev(div7, "class", "content svelte-1dwvoh5");
    			add_location(div7, file$8, 99, 1, 2783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			if (if_block) if_block.m(div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div4, p);
    			append_dev(div4, t6);
    			mount_component(grass, div4, null);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div6, t8);
    			mount_component(commitrequest, div6, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*challenge*/ 2) && t0_value !== (t0_value = /*challenge*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*challenge*/ 2) && t2_value !== (t2_value = /*challenge*/ ctx[1].description + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*challenge, $user*/ 18) show_if = !/*challenge*/ ctx[1].member.includes(/*$user*/ ctx[4].githubId);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*challenge, $user*/ 18) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const grass_changes = {};
    			if (dirty & /*grass_team*/ 8) grass_changes.grass_list = /*grass_team*/ ctx[3];
    			if (dirty & /*challenge*/ 2) grass_changes.group_num = /*challenge*/ ctx[1].member.length;
    			grass.$set(grass_changes);

    			if (dirty & /*grass_list, challenge, Array*/ 6) {
    				each_value = /*challenge*/ ctx[1].member;
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
    						each_blocks[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const commitrequest_changes = {};
    			if (dirty & /*challenge*/ 2) commitrequest_changes.group = /*challenge*/ ctx[1].member;
    			commitrequest.$set(commitrequest_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(grass.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(commitrequest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(grass.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(commitrequest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div7);
    			destroy_component(grass);
    			destroy_each(each_blocks, detaching);
    			destroy_component(commitrequest);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(81:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:0) {#if isPrivate}
    function create_if_block$3(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div3;
    	let button;
    	let t4;
    	let img;
    	let img_src_value;
    	let current;

    	button = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#B8FFC8",
    				onClick: /*joinButtonClick*/ ctx[6],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "private challenge";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "-";
    			t3 = space();
    			div3 = element("div");
    			create_component(button.$$.fragment);
    			t4 = space();
    			img = element("img");
    			attr_dev(div0, "class", "upper_title svelte-1dwvoh5");
    			add_location(div0, file$8, 65, 3, 1927);
    			attr_dev(div1, "class", "upper_description svelte-1dwvoh5");
    			add_location(div1, file$8, 66, 3, 1979);
    			attr_dev(div2, "class", "title_desc");
    			add_location(div2, file$8, 64, 2, 1899);
    			attr_dev(div3, "class", "join");
    			add_location(div3, file$8, 68, 3, 2030);
    			attr_dev(div4, "class", "upper svelte-1dwvoh5");
    			add_location(div4, file$8, 63, 1, 1877);
    			attr_dev(img, "class", "challenge_default_image svelte-1dwvoh5");
    			if (!src_url_equal(img.src, img_src_value = "images/challenge_detail_default.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "blur_image");
    			add_location(img, file$8, 79, 1, 2236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			mount_component(button, div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, img, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
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
    			if (detaching) detach_dev(div4);
    			destroy_component(button);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(63:0) {#if isPrivate}",
    		ctx
    	});

    	return block;
    }

    // (87:2) {#if !challenge.member.includes($user.githubId)}
    function create_if_block_2$1(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#B8FFC8",
    				onClick: /*joinButtonClick*/ ctx[6],
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "join");
    			add_location(div, file$8, 87, 3, 2569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(87:2) {#if !challenge.member.includes($user.githubId)}",
    		ctx
    	});

    	return block;
    }

    // (89:4) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinButtonClick}     >
    function create_default_slot_1$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "JOIN";
    			attr_dev(div, "class", "btn_txt");
    			add_location(div, file$8, 94, 5, 2710);
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(89:4) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinButtonClick}     >",
    		ctx
    	});

    	return block;
    }

    // (121:6) {:else}
    function create_else_block_1$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "불러오는 중입니다.";
    			add_location(p, file$8, 121, 7, 3391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(121:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (119:6) {#if Array.isArray(grass_list[member])}
    function create_if_block_1$3(ctx) {
    	let grass;
    	let current;

    	grass = new Grass({
    			props: {
    				grass_list: /*grass_list*/ ctx[2][/*member*/ ctx[9]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grass.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grass, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grass_changes = {};
    			if (dirty & /*grass_list, challenge*/ 6) grass_changes.grass_list = /*grass_list*/ ctx[2][/*member*/ ctx[9]];
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
    			destroy_component(grass, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(119:6) {#if Array.isArray(grass_list[member])}",
    		ctx
    	});

    	return block;
    }

    // (113:4) {#each challenge.member as member}
    function create_each_block$3(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*member*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t3;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*grass_list, challenge*/ 6) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*grass_list*/ ctx[2][/*member*/ ctx[9]]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

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
    			if_block.c();
    			t4 = space();
    			set_style(p0, "font-weight", "bold");
    			add_location(p0, file$8, 115, 7, 3201);
    			add_location(p1, file$8, 116, 7, 3250);
    			attr_dev(div0, "class", "grass_title svelte-1dwvoh5");
    			add_location(div0, file$8, 114, 6, 3168);
    			attr_dev(div1, "class", "personal_grass svelte-1dwvoh5");
    			add_location(div1, file$8, 113, 5, 3133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*challenge*/ 2) && t0_value !== (t0_value = /*member*/ ctx[9] + "")) set_data_dev(t0, t0_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx, dirty);

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
    				if_block.m(div1, t4);
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
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(113:4) {#each challenge.member as member}",
    		ctx
    	});

    	return block;
    }

    // (70:4) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinButtonClick}     >
    function create_default_slot$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "JOIN";
    			attr_dev(div, "class", "btn_txt");
    			add_location(div, file$8, 75, 5, 2171);
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
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(70:4) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinButtonClick}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isPrivate*/ ctx[0]) return 0;
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(4, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChallengeDetail', slots, []);
    	let { params = {} } = $$props;
    	let isPrivate = true;
    	let challenge = null;
    	let grass_list = {};
    	let grass_amount = 365 + new Date().getDay();
    	let grass_team = new Array(grass_amount);

    	for (let i = 0; i < grass_amount; i += 1) {
    		grass_team[i] = { date: '', count: 0 };
    	}

    	beforeUpdate(() => {
    		if (!$user) {
    			if (localStorage.getItem(ACCESS_TOKEN)) getUser(); else push('/login');
    		}
    	});

    	onMount(async () => {
    		$$invalidate(1, challenge = await getChallenge(params.id));

    		if (challenge.status != 401) {
    			$$invalidate(0, isPrivate = false);
    		} else {
    			return;
    		}

    		challenge.member.map(member_id => {
    			const member_grass = getGrass(member_id);

    			member_grass.then(value => {
    				$$invalidate(2, grass_list[member_id] = value, grass_list);

    				for (let i = 0; i < grass_amount; i++) {
    					if (grass_list[member_id][i].count > 0) $$invalidate(3, grass_team[i].count += 1, grass_team);
    				}
    			});
    		});
    	});

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

    	function joinButtonClick() {
    		joinChallenge(params.id);
    		alert("챌린지 가입 성공!");
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChallengeDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(7, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		Grass,
    		CommitRequest,
    		getChallenge,
    		joinChallenge,
    		ACCESS_TOKEN,
    		user,
    		getUser,
    		getGrass,
    		Button,
    		Loader,
    		params,
    		isPrivate,
    		challenge,
    		grass_list,
    		grass_amount,
    		grass_team,
    		req_list,
    		joinButtonClick,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(7, params = $$props.params);
    		if ('isPrivate' in $$props) $$invalidate(0, isPrivate = $$props.isPrivate);
    		if ('challenge' in $$props) $$invalidate(1, challenge = $$props.challenge);
    		if ('grass_list' in $$props) $$invalidate(2, grass_list = $$props.grass_list);
    		if ('grass_amount' in $$props) grass_amount = $$props.grass_amount;
    		if ('grass_team' in $$props) $$invalidate(3, grass_team = $$props.grass_team);
    		if ('req_list' in $$props) $$invalidate(5, req_list = $$props.req_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isPrivate,
    		challenge,
    		grass_list,
    		grass_team,
    		$user,
    		req_list,
    		joinButtonClick,
    		params
    	];
    }

    class ChallengeDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChallengeDetail",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get params() {
    		throw new Error("<ChallengeDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ChallengeDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/CreateChallenge.svelte generated by Svelte v3.46.3 */
    const file$7 = "src/pages/CreateChallenge.svelte";

    // (67:3) <Button      width='7rem'     height='2.5rem'     backgroundColor='var(--main-green-color)'     onClick={save}    >
    function create_default_slot_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Create";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$7, 72, 4, 1997);
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(67:3) <Button      width='7rem'     height='2.5rem'     backgroundColor='var(--main-green-color)'     onClick={save}    >",
    		ctx
    	});

    	return block;
    }

    // (76:3) <Button      width='7rem'     height='2.5rem'     backgroundColor='#E3E3E3'     onClick={cancel}    >
    function create_default_slot$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cancel";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$7, 81, 4, 2157);
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(76:3) <Button      width='7rem'     height='2.5rem'     backgroundColor='#E3E3E3'     onClick={cancel}    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    	let input0;
    	let updating_bindvalue;
    	let t7;
    	let div2;
    	let t9;
    	let input1;
    	let updating_bindvalue_1;
    	let t10;
    	let hr1;
    	let t11;
    	let div12;
    	let div7;
    	let input2;
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
    	let input3;
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
    	let mounted;
    	let dispose;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });

    	function input0_bindvalue_binding(value) {
    		/*input0_bindvalue_binding*/ ctx[5](value);
    	}

    	let input0_props = { maxlength: "20", size: "20" };

    	if (/*challengename*/ ctx[0] !== void 0) {
    		input0_props.bindvalue = /*challengename*/ ctx[0];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'bindvalue', input0_bindvalue_binding));

    	function input1_bindvalue_binding(value) {
    		/*input1_bindvalue_binding*/ ctx[6](value);
    	}

    	let input1_props = { size: "80" };

    	if (/*description*/ ctx[1] !== void 0) {
    		input1_props.bindvalue = /*description*/ ctx[1];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'bindvalue', input1_bindvalue_binding));

    	button0 = new Button({
    			props: {
    				width: "7rem",
    				height: "2.5rem",
    				backgroundColor: "var(--main-green-color)",
    				onClick: /*save*/ ctx[3],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				width: "7rem",
    				height: "2.5rem",
    				backgroundColor: "#E3E3E3",
    				onClick: /*cancel*/ ctx[4],
    				$$slots: { default: [create_default_slot$5] },
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
    			t4 = text("Challenge name\n\t\t\t\t");
    			span = element("span");
    			span.textContent = "*";
    			t6 = space();
    			create_component(input0.$$.fragment);
    			t7 = space();
    			div2 = element("div");
    			div2.textContent = "Description";
    			t9 = space();
    			create_component(input1.$$.fragment);
    			t10 = space();
    			hr1 = element("hr");
    			t11 = space();
    			div12 = element("div");
    			div7 = element("div");
    			input2 = element("input");
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
    			input3 = element("input");
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
    			attr_dev(div0, "class", "title svelte-ffg6jw");
    			add_location(div0, file$7, 33, 2, 735);
    			attr_dev(hr0, "align", "left");
    			attr_dev(hr0, "class", "hr svelte-ffg6jw");
    			add_location(hr0, file$7, 34, 2, 781);
    			set_style(span, "color", "red");
    			add_location(span, file$7, 37, 4, 872);
    			attr_dev(div1, "class", "text svelte-ffg6jw");
    			add_location(div1, file$7, 36, 3, 837);
    			attr_dev(div2, "class", "text svelte-ffg6jw");
    			add_location(div2, file$7, 41, 3, 987);
    			attr_dev(div3, "class", "sub_content svelte-ffg6jw");
    			add_location(div3, file$7, 35, 2, 810);
    			attr_dev(hr1, "align", "left");
    			attr_dev(hr1, "class", "hr svelte-ffg6jw");
    			add_location(hr1, file$7, 45, 2, 1082);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "secure");
    			input2.checked = "check";
    			input2.__value = false;
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[8][0].push(input2);
    			add_location(input2, file$7, 48, 4, 1162);
    			attr_dev(img0, "class", "image svelte-ffg6jw");
    			if (!src_url_equal(img0.src, img0_src_value = "images/public.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "public_img");
    			add_location(img0, file$7, 49, 4, 1253);
    			attr_dev(div4, "class", "small_text svelte-ffg6jw");
    			add_location(div4, file$7, 51, 5, 1331);
    			attr_dev(div5, "class", "explain_text svelte-ffg6jw");
    			add_location(div5, file$7, 52, 5, 1371);
    			add_location(div6, file$7, 50, 4, 1320);
    			attr_dev(div7, "class", "contain svelte-ffg6jw");
    			add_location(div7, file$7, 47, 3, 1138);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "secure");
    			attr_dev(input3, "align", "middle");
    			input3.__value = true;
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[8][0].push(input3);
    			add_location(input3, file$7, 56, 4, 1496);
    			attr_dev(img1, "class", "image svelte-ffg6jw");
    			if (!src_url_equal(img1.src, img1_src_value = "images/private.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "private_img");
    			add_location(img1, file$7, 57, 4, 1586);
    			attr_dev(div8, "class", "small_text svelte-ffg6jw");
    			add_location(div8, file$7, 59, 5, 1666);
    			attr_dev(div9, "class", "explain_text svelte-ffg6jw");
    			add_location(div9, file$7, 60, 5, 1707);
    			add_location(div10, file$7, 58, 4, 1655);
    			attr_dev(div11, "class", "contain svelte-ffg6jw");
    			add_location(div11, file$7, 55, 3, 1472);
    			attr_dev(div12, "class", "sub_content svelte-ffg6jw");
    			add_location(div12, file$7, 46, 2, 1111);
    			attr_dev(hr2, "align", "left");
    			attr_dev(hr2, "class", "hr svelte-ffg6jw");
    			add_location(hr2, file$7, 64, 2, 1820);
    			attr_dev(div13, "class", "sub_content svelte-ffg6jw");
    			add_location(div13, file$7, 65, 2, 1849);
    			attr_dev(div14, "class", "content svelte-ffg6jw");
    			add_location(div14, file$7, 32, 1, 711);
    			attr_dev(div15, "class", "page svelte-ffg6jw");
    			add_location(div15, file$7, 31, 0, 691);
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
    			mount_component(input0, div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div3, t9);
    			mount_component(input1, div3, null);
    			append_dev(div14, t10);
    			append_dev(div14, hr1);
    			append_dev(div14, t11);
    			append_dev(div14, div12);
    			append_dev(div12, div7);
    			append_dev(div7, input2);
    			input2.checked = input2.__value === /*isPrivate*/ ctx[2];
    			append_dev(div7, t12);
    			append_dev(div7, img0);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, input3);
    			input3.checked = input3.__value === /*isPrivate*/ ctx[2];
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

    			if (!mounted) {
    				dispose = [
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};

    			if (!updating_bindvalue && dirty & /*challengename*/ 1) {
    				updating_bindvalue = true;
    				input0_changes.bindvalue = /*challengename*/ ctx[0];
    				add_flush_callback(() => updating_bindvalue = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_bindvalue_1 && dirty & /*description*/ 2) {
    				updating_bindvalue_1 = true;
    				input1_changes.bindvalue = /*description*/ ctx[1];
    				add_flush_callback(() => updating_bindvalue_1 = false);
    			}

    			input1.$set(input1_changes);

    			if (dirty & /*isPrivate*/ 4) {
    				input2.checked = input2.__value === /*isPrivate*/ ctx[2];
    			}

    			if (dirty & /*isPrivate*/ 4) {
    				input3.checked = input3.__value === /*isPrivate*/ ctx[2];
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div15);
    			destroy_component(input0);
    			destroy_component(input1);
    			/*$$binding_groups*/ ctx[8][0].splice(/*$$binding_groups*/ ctx[8][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[8][0].splice(/*$$binding_groups*/ ctx[8][0].indexOf(input3), 1);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('CreateChallenge', slots, []);
    	let challengename = "";
    	let description = "";
    	let isPrivate = false;

    	async function sendToServer() {
    		const data = await fetchPost('challenges', {
    			'name': challengename,
    			description,
    			isPrivate
    		});

    		return data;
    	}

    	function save() {
    		if (challengename == '') alert("이름을 입력해주세요."); else {
    			sendToServer();
    			alert("챌린지 생성 성공!.");
    			push$1('/');
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

    	const $$binding_groups = [[]];

    	function input0_bindvalue_binding(value) {
    		challengename = value;
    		$$invalidate(0, challengename);
    	}

    	function input1_bindvalue_binding(value) {
    		description = value;
    		$$invalidate(1, description);
    	}

    	function input2_change_handler() {
    		isPrivate = this.__value;
    		$$invalidate(2, isPrivate);
    	}

    	function input3_change_handler() {
    		isPrivate = this.__value;
    		$$invalidate(2, isPrivate);
    	}

    	$$self.$capture_state = () => ({
    		push: push$1,
    		pop,
    		Button,
    		Input,
    		fetchPost,
    		GlobalNavigationBar,
    		challengename,
    		description,
    		isPrivate,
    		sendToServer,
    		save,
    		cancel
    	});

    	$$self.$inject_state = $$props => {
    		if ('challengename' in $$props) $$invalidate(0, challengename = $$props.challengename);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('isPrivate' in $$props) $$invalidate(2, isPrivate = $$props.isPrivate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		challengename,
    		description,
    		isPrivate,
    		save,
    		cancel,
    		input0_bindvalue_binding,
    		input1_bindvalue_binding,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler
    	];
    }

    class CreateChallenge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateChallenge",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/ChallengeBox.svelte generated by Svelte v3.46.3 */
    const file$6 = "src/components/ChallengeBox.svelte";

    // (27:5) {#if isLeader}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon Box__icon--left svelte-aquluz");
    			if (!src_url_equal(img.src, img_src_value = "images/setting.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "setting");
    			add_location(img, file$6, 27, 6, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickSetting*/ ctx[5], false, false, false);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(27:5) {#if isLeader}",
    		ctx
    	});

    	return block;
    }

    // (32:5) {:else}
    function create_else_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon svelte-aquluz");
    			if (!src_url_equal(img.src, img_src_value = "images/star-line.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "star_outline");
    			add_location(img, file$6, 32, 6, 906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickStar*/ ctx[4], false, false, false);
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(32:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:5) {#if isStarred}
    function create_if_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "Box__icon Box__icon--yellow svelte-aquluz");
    			if (!src_url_equal(img.src, img_src_value = "images/star.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "star");
    			add_location(img, file$6, 30, 6, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*onClickStar*/ ctx[4], false, false, false);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(30:5) {#if isStarred}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div7;
    	let div3;
    	let div1;
    	let span;
    	let t0_value = /*challenge*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = (/*challenge*/ ctx[0].description || '') + "";
    	let t4;
    	let t5;
    	let div6;
    	let div4;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let t7_value = (/*challenge*/ ctx[0].member.length || 0) + "";
    	let t7;
    	let t8;
    	let div5;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let t10_value = (/*challenge*/ ctx[0].leader || '') + "";
    	let t10;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isLeader*/ ctx[2] && create_if_block_1$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*isStarred*/ ctx[1]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
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
    			attr_dev(span, "class", "Box__header__title svelte-aquluz");
    			add_location(span, file$6, 24, 3, 500);
    			attr_dev(div0, "class", "Box__header__group svelte-aquluz");
    			add_location(div0, file$6, 25, 3, 584);
    			attr_dev(div1, "class", "Box__header svelte-aquluz");
    			add_location(div1, file$6, 23, 2, 471);
    			attr_dev(div2, "class", "Box__content");
    			add_location(div2, file$6, 36, 2, 1032);
    			add_location(div3, file$6, 22, 1, 463);
    			attr_dev(img0, "class", "Box__icon svelte-aquluz");
    			if (!src_url_equal(img0.src, img0_src_value = "images/human.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "human");
    			add_location(img0, file$6, 42, 3, 1174);
    			attr_dev(div4, "class", "Box__footer__group svelte-aquluz");
    			add_location(div4, file$6, 41, 2, 1138);
    			attr_dev(img1, "class", "Box__icon svelte-aquluz");
    			if (!src_url_equal(img1.src, img1_src_value = "images/crown.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "crown");
    			add_location(img1, file$6, 46, 3, 1315);
    			attr_dev(div5, "class", "Box__footer__group svelte-aquluz");
    			add_location(div5, file$6, 45, 2, 1279);
    			attr_dev(div6, "class", "Box__footer svelte-aquluz");
    			add_location(div6, file$6, 40, 1, 1110);
    			attr_dev(div7, "class", "Box svelte-aquluz");
    			add_location(div7, file$6, 21, 0, 444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span);
    			append_dev(span, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t2);
    			if_block1.m(div0, null);
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

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*onClickTitle*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*challenge*/ 1 && t0_value !== (t0_value = /*challenge*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (/*isLeader*/ ctx[2]) if_block0.p(ctx, dirty);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			}

    			if (dirty & /*challenge*/ 1 && t4_value !== (t4_value = (/*challenge*/ ctx[0].description || '') + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*challenge*/ 1 && t7_value !== (t7_value = (/*challenge*/ ctx[0].member.length || 0) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*challenge*/ 1 && t10_value !== (t10_value = (/*challenge*/ ctx[0].leader || '') + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
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
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChallengeBox', slots, []);
    	let { challenge } = $$props;
    	const isLeader = $user?.githubId === challenge.leader;
    	let isStarred = challenge.isStarred;

    	function onClickTitle() {
    		push$1(`/challenge/${challenge.id}`);
    	}

    	function onClickStar() {
    		// TODO: debounce같은 거 걸어서 api 요청하기
    		$$invalidate(1, isStarred = !isStarred);
    	}

    	function onClickSetting() {
    		push$1(`/setting/${challenge.id}`);
    	}

    	const writable_props = ['challenge'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChallengeBox> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('challenge' in $$props) $$invalidate(0, challenge = $$props.challenge);
    	};

    	$$self.$capture_state = () => ({
    		push: push$1,
    		user,
    		challenge,
    		isLeader,
    		isStarred,
    		onClickTitle,
    		onClickStar,
    		onClickSetting,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('challenge' in $$props) $$invalidate(0, challenge = $$props.challenge);
    		if ('isStarred' in $$props) $$invalidate(1, isStarred = $$props.isStarred);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [challenge, isStarred, isLeader, onClickTitle, onClickStar, onClickSetting];
    }

    class ChallengeBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { challenge: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChallengeBox",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*challenge*/ ctx[0] === undefined && !('challenge' in props)) {
    			console.warn("<ChallengeBox> was created without expected prop 'challenge'");
    		}
    	}

    	get challenge() {
    		throw new Error("<ChallengeBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set challenge(value) {
    		throw new Error("<ChallengeBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/MyChallengeList.svelte generated by Svelte v3.46.3 */

    const file$5 = "src/pages/MyChallengeList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (50:3) <Button {onClick} width="4rem" height="1.9rem" backgroundColor="#50CE92" style="border: none; color: white;">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("New");
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(50:3) <Button {onClick} width=\\\"4rem\\\" height=\\\"1.9rem\\\" backgroundColor=\\\"#50CE92\\\" style=\\\"border: none; color: white;\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:3) {#each filteredList as challenge}
    function create_each_block$2(ctx) {
    	let challengebox;
    	let current;

    	challengebox = new ChallengeBox({
    			props: { challenge: /*challenge*/ ctx[5] },
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
    			if (dirty & /*filteredList*/ 1) challengebox_changes.challenge = /*challenge*/ ctx[5];
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(53:3) {#each filteredList as challenge}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let globalnavigationbar;
    	let t0;
    	let div3;
    	let profile;
    	let t1;
    	let div2;
    	let div0;
    	let searchinput;
    	let t2;
    	let button;
    	let t3;
    	let div1;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	profile = new Profile({ $$inline: true });

    	searchinput = new SearchInput({
    			props: {
    				searchHandler: /*searchHandler*/ ctx[2],
    				changeHandler: /*changeHandler*/ ctx[3]
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				onClick: /*onClick*/ ctx[1],
    				width: "4rem",
    				height: "1.9rem",
    				backgroundColor: "#50CE92",
    				style: "border: none; color: white;",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*filteredList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			create_component(profile.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(searchinput.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "MyChallengeList__input-box svelte-cu6oox");
    			add_location(div0, file$5, 47, 2, 1188);
    			attr_dev(div1, "class", "MyChallengeList__list svelte-cu6oox");
    			add_location(div1, file$5, 51, 2, 1416);
    			attr_dev(div2, "class", "MyChallengeList__content svelte-cu6oox");
    			add_location(div2, file$5, 46, 1, 1147);
    			attr_dev(div3, "class", "MyChallengeList svelte-cu6oox");
    			add_location(div3, file$5, 44, 0, 1103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(profile, div3, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(searchinput, div0, null);
    			append_dev(div0, t2);
    			mount_component(button, div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*filteredList*/ 1) {
    				each_value = /*filteredList*/ ctx[0];
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
    						each_blocks[i].m(div1, null);
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
    			transition_in(searchinput.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(searchinput.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(profile);
    			destroy_component(searchinput);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
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
    	let $myChallengeList;
    	validate_store(myChallengeList, 'myChallengeList');
    	component_subscribe($$self, myChallengeList, $$value => $$invalidate(4, $myChallengeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyChallengeList', slots, []);
    	let filteredList = [];

    	function onClick() {
    		push$1('/createchallenge');
    	}

    	onMount(async () => {
    		changeTab(index.MYCHALLENGE);
    		await getUserChallenge();
    		$$invalidate(0, filteredList = $myChallengeList);
    	});

    	onDestroy(() => {
    		changeTab(index.HOME);
    	});

    	async function searchHandler(val) {
    		await getUserChallenge();
    		$$invalidate(0, filteredList = $myChallengeList.filter(challenge => challenge.name.includes(val)));
    	}

    	function changeHandler(val) {
    		$$invalidate(0, filteredList = $myChallengeList.filter(challenge => challenge.name.includes(val)));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyChallengeList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		push: push$1,
    		changeTab,
    		index,
    		GlobalNavigationBar,
    		Profile,
    		ChallengeBox,
    		Button,
    		SearchInput,
    		myChallengeList,
    		getUserChallenge,
    		myChallengePage,
    		filteredList,
    		onClick,
    		searchHandler,
    		changeHandler,
    		$myChallengeList
    	});

    	$$self.$inject_state = $$props => {
    		if ('filteredList' in $$props) $$invalidate(0, filteredList = $$props.filteredList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [filteredList, onClick, searchHandler, changeHandler];
    }

    class MyChallengeList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyChallengeList",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/PagingDiv.svelte generated by Svelte v3.46.3 */
    const file$4 = "src/components/PagingDiv.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (52:3) {#if $totalPages!=0}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let if_block0 = /*first_page_num*/ ctx[3] > 10 && create_if_block_3(ctx);
    	let each_value = /*button_num_arr*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block1 = /*first_page_num*/ ctx[3] + 10 < /*$totalPages*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*first_page_num*/ ctx[3] > 10) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*button_num_arr, getDataFunc, changeRecentNum, recent_page*/ 149) {
    				each_value = /*button_num_arr*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*first_page_num*/ ctx[3] + 10 < /*$totalPages*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(52:3) {#if $totalPages!=0}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if first_page_num>10}
    function create_if_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "<";
    			attr_dev(button, "class", "Paging__move_button svelte-1biztz4");
    			add_location(button, file$4, 53, 12, 1338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clickLeftBtn*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(53:8) {#if first_page_num>10}",
    		ctx
    	});

    	return block;
    }

    // (62:12) {:else}
    function create_else_block$1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1_value = /*i*/ ctx[11] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function change_handler_1() {
    		return /*change_handler_1*/ ctx[9](/*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "page_num");
    			attr_dev(input, "class", "svelte-1biztz4");
    			add_location(input, file$4, 63, 20, 1820);
    			attr_dev(span, "class", "svelte-1biztz4");
    			add_location(span, file$4, 64, 20, 1931);
    			attr_dev(label, "class", "Paging__button svelte-1biztz4");
    			add_location(label, file$4, 62, 16, 1769);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*button_num_arr*/ 16 && t1_value !== (t1_value = /*i*/ ctx[11] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(62:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {#if recent_page==i}
    function create_if_block_2(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1_value = /*i*/ ctx[11] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			input.checked = "checked";
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "page_num");
    			attr_dev(input, "class", "svelte-1biztz4");
    			add_location(input, file$4, 58, 20, 1562);
    			attr_dev(span, "class", "svelte-1biztz4");
    			add_location(span, file$4, 59, 20, 1691);
    			attr_dev(label, "class", "Paging__button svelte-1biztz4");
    			add_location(label, file$4, 57, 16, 1511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					input,
    					"change",
    					function () {
    						if (is_function((/*changeRecentNum*/ ctx[7](/*i*/ ctx[11])))) (/*changeRecentNum*/ ctx[7](/*i*/ ctx[11])).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*button_num_arr*/ 16 && t1_value !== (t1_value = /*i*/ ctx[11] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(57:12) {#if recent_page==i}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#each button_num_arr as i}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*recent_page*/ ctx[2] == /*i*/ ctx[11]) return create_if_block_2;
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(56:8) {#each button_num_arr as i}",
    		ctx
    	});

    	return block;
    }

    // (69:8) {#if first_page_num+10<$totalPages}
    function create_if_block_1$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = ">";
    			attr_dev(button, "class", "Paging__move_button svelte-1biztz4");
    			add_location(button, file$4, 69, 12, 2063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clickRightBtn*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(69:8) {#if first_page_num+10<$totalPages}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let if_block = /*$totalPages*/ ctx[1] != 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "Paging svelte-1biztz4");
    			add_location(div, file$4, 50, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$totalPages*/ ctx[1] != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	let $totalPages;
    	validate_store(totalPages, 'totalPages');
    	component_subscribe($$self, totalPages, $$value => $$invalidate(1, $totalPages = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PagingDiv', slots, []);
    	let { getDataFunc } = $$props;
    	let recent_page = 1;
    	let first_page_num = 1;
    	let button_num_arr = [];

    	onMount(() => {
    		returnAllPageNum();
    	});

    	function returnAllPageNum() {
    		let array = Array();
    		$$invalidate(3, first_page_num = Math.floor(recent_page / 10) * 10 + 1);

    		if (first_page_num + 10 >= $totalPages) {
    			for (let i = first_page_num; i <= $totalPages; i++) array.push(i);
    		} else {
    			for (let i = first_page_num; i < first_page_num + 10; i++) array.push(i);
    		}

    		$$invalidate(4, button_num_arr = array);
    	}

    	function clickLeftBtn() {
    		if (recent_page - 10 < 0) changeRecentNum(1); else changeRecentNum(recent_page - 10);
    		getDataFunc(recent_page);
    		returnAllPageNum();
    	}

    	function clickRightBtn() {
    		if (recent_page + 10 >= $totalPages) {
    			changeRecentNum($totalPages);
    		} else {
    			changeRecentNum(recent_page + 10);
    		}

    		getDataFunc(recent_page);
    		returnAllPageNum();
    	}

    	const changeRecentNum = i => {
    		$$invalidate(2, recent_page = i);
    	};

    	const writable_props = ['getDataFunc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PagingDiv> was created with unknown prop '${key}'`);
    	});

    	const change_handler = i => {
    		getDataFunc(i);
    	};

    	const change_handler_1 = i => {
    		(getDataFunc(i), changeRecentNum(i));
    	};

    	$$self.$$set = $$props => {
    		if ('getDataFunc' in $$props) $$invalidate(0, getDataFunc = $$props.getDataFunc);
    	};

    	$$self.$capture_state = () => ({
    		totalPages,
    		onMount,
    		afterUpdate,
    		getDataFunc,
    		recent_page,
    		first_page_num,
    		button_num_arr,
    		returnAllPageNum,
    		clickLeftBtn,
    		clickRightBtn,
    		changeRecentNum,
    		$totalPages
    	});

    	$$self.$inject_state = $$props => {
    		if ('getDataFunc' in $$props) $$invalidate(0, getDataFunc = $$props.getDataFunc);
    		if ('recent_page' in $$props) $$invalidate(2, recent_page = $$props.recent_page);
    		if ('first_page_num' in $$props) $$invalidate(3, first_page_num = $$props.first_page_num);
    		if ('button_num_arr' in $$props) $$invalidate(4, button_num_arr = $$props.button_num_arr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$totalPages*/ 2) {
    			(returnAllPageNum());
    		}
    	};

    	return [
    		getDataFunc,
    		$totalPages,
    		recent_page,
    		first_page_num,
    		button_num_arr,
    		clickLeftBtn,
    		clickRightBtn,
    		changeRecentNum,
    		change_handler,
    		change_handler_1
    	];
    }

    class PagingDiv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { getDataFunc: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PagingDiv",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*getDataFunc*/ ctx[0] === undefined && !('getDataFunc' in props)) {
    			console.warn("<PagingDiv> was created without expected prop 'getDataFunc'");
    		}
    	}

    	get getDataFunc() {
    		throw new Error("<PagingDiv>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getDataFunc(value) {
    		throw new Error("<PagingDiv>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/TotalChallengeList.svelte generated by Svelte v3.46.3 */
    const file$3 = "src/pages/TotalChallengeList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (73:16) <Button onClick={onClickCreateChallenge} width="4rem" height="1.9rem" backgroundColor="#50CE92" style="border: none; color: white;">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("New");
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(73:16) <Button onClick={onClickCreateChallenge} width=\\\"4rem\\\" height=\\\"1.9rem\\\" backgroundColor=\\\"#50CE92\\\" style=\\\"border: none; color: white;\\\">",
    		ctx
    	});

    	return block;
    }

    // (79:20) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>
    function create_default_slot$3(ctx) {
    	let t_value = /*item*/ ctx[12] + "";
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(79:20) <SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>",
    		ctx
    	});

    	return block;
    }

    // (77:12) {#each tabItem as item, index}
    function create_each_block_1(ctx) {
    	let div;
    	let subnavitem;
    	let t;
    	let current;

    	function func() {
    		return /*func*/ ctx[6](/*index*/ ctx[14]);
    	}

    	subnavitem = new SubNavigationItem({
    			props: {
    				onClick: func,
    				isActive: /*activeItem*/ ctx[0] === /*index*/ ctx[14],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(subnavitem.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "Page__sort__font svelte-1c0ugx3");
    			add_location(div, file$3, 77, 16, 2213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(subnavitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const subnavitem_changes = {};
    			if (dirty & /*activeItem*/ 1) subnavitem_changes.isActive = /*activeItem*/ ctx[0] === /*index*/ ctx[14];

    			if (dirty & /*$$scope*/ 32768) {
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
    			if (detaching) detach_dev(div);
    			destroy_component(subnavitem);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(77:12) {#each tabItem as item, index}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#each $challengeList as c}
    function create_each_block(ctx) {
    	let challengebox;
    	let current;

    	challengebox = new ChallengeBox({
    			props: { challenge: /*c*/ ctx[9] },
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
    			if (dirty & /*$challengeList*/ 2) challengebox_changes.challenge = /*c*/ ctx[9];
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
    		source: "(83:8) {#each $challengeList as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let toast;
    	let t0;
    	let globalnavigationbar;
    	let t1;
    	let div5;
    	let profile;
    	let t2;
    	let div4;
    	let div2;
    	let div0;
    	let searchinput;
    	let t3;
    	let div1;
    	let button;
    	let t4;
    	let div3;
    	let t5;
    	let t6;
    	let pagingdiv;
    	let current;
    	toast = new Toast({ $$inline: true });
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	profile = new Profile({ $$inline: true });
    	searchinput = new SearchInput({ props: { searchHandler }, $$inline: true });

    	button = new Button({
    			props: {
    				onClick: /*onClickCreateChallenge*/ ctx[5],
    				width: "4rem",
    				height: "1.9rem",
    				backgroundColor: "#50CE92",
    				style: "border: none; color: white;",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*tabItem*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$challengeList*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	pagingdiv = new PagingDiv({
    			props: { getDataFunc: /*getChallenge*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toast.$$.fragment);
    			t0 = space();
    			create_component(globalnavigationbar.$$.fragment);
    			t1 = space();
    			div5 = element("div");
    			create_component(profile.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(searchinput.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(button.$$.fragment);
    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			create_component(pagingdiv.$$.fragment);
    			attr_dev(div0, "class", "Page__top__search svelte-1c0ugx3");
    			add_location(div0, file$3, 66, 12, 1744);
    			attr_dev(div1, "class", "Page__top__create_btn svelte-1c0ugx3");
    			add_location(div1, file$3, 71, 12, 1890);
    			attr_dev(div2, "class", "Page__top svelte-1c0ugx3");
    			add_location(div2, file$3, 65, 8, 1708);
    			attr_dev(div3, "class", "Page__sort svelte-1c0ugx3");
    			add_location(div3, file$3, 75, 8, 2129);
    			attr_dev(div4, "class", "Page__content svelte-1c0ugx3");
    			add_location(div4, file$3, 64, 4, 1672);
    			attr_dev(div5, "class", "Page svelte-1c0ugx3");
    			add_location(div5, file$3, 61, 0, 1628);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(toast, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(profile, div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			mount_component(searchinput, div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			mount_component(button, div1, null);
    			append_dev(div4, t4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div4, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div4, t6);
    			mount_component(pagingdiv, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*onClickItem, activeItem, tabItem*/ 13) {
    				each_value_1 = /*tabItem*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$challengeList*/ 2) {
    				each_value = /*$challengeList*/ ctx[1];
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
    						each_blocks[i].m(div4, t6);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toast.$$.fragment, local);
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			transition_in(searchinput.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(pagingdiv.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toast.$$.fragment, local);
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(searchinput.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(pagingdiv.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toast, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div5);
    			destroy_component(profile);
    			destroy_component(searchinput);
    			destroy_component(button);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(pagingdiv);
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

    function searchHandler(val) {
    	alert(val);
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $challengeList;
    	validate_store(challengeList, 'challengeList');
    	component_subscribe($$self, challengeList, $$value => $$invalidate(1, $challengeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TotalChallengeList', slots, []);
    	const tabItem = ['\0TITLE', '\0DESCRIPTION', '\0LEADER'];
    	let activeItem = 0;
    	let view_item_num = 1; //TODO : 한 페이지에 보여질 CHALLENGE 개수 정할 수 있도록

    	function onClickItem(i) {
    		$$invalidate(0, activeItem = i);
    	}

    	function setActive(i) {
    		if (i === activeItem) return true;
    	}

    	function getChallenge(i) {
    		getAllChallenge(i, view_item_num);
    	}

    	function onClickCreateChallenge() {
    		push$1('/createchallenge');
    	}

    	onMount(() => {
    		getChallenge(1);
    		changeTab(index.OTHERS);
    	});

    	onDestroy(() => {
    		changeTab(index.HOME);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TotalChallengeList> was created with unknown prop '${key}'`);
    	});

    	const func = index => onClickItem(index);

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		push: push$1,
    		changeTab,
    		challengeList,
    		totalPages,
    		getAllChallenge,
    		index,
    		Profile,
    		GlobalNavigationBar,
    		ChallengeBox,
    		PagingDiv,
    		Toast,
    		Input,
    		Button,
    		SubNavItem: SubNavigationItem,
    		SearchInput,
    		notifications,
    		tabItem,
    		activeItem,
    		view_item_num,
    		onClickItem,
    		setActive,
    		getChallenge,
    		onClickCreateChallenge,
    		searchHandler,
    		$challengeList
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    		if ('view_item_num' in $$props) view_item_num = $$props.view_item_num;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeItem,
    		$challengeList,
    		tabItem,
    		onClickItem,
    		getChallenge,
    		onClickCreateChallenge,
    		func
    	];
    }

    class TotalChallengeList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TotalChallengeList",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/pages/EditProfile.svelte generated by Svelte v3.46.3 */
    const file_1 = "src/pages/EditProfile.svelte";

    // (134:0) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*refuseEnter*/ ctx[8]() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(134:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:0) {#if $user}
    function create_if_block(ctx) {
    	let div7;
    	let div6;
    	let div1;
    	let t0;
    	let label;
    	let div0;
    	let t2;
    	let input0;
    	let t3;
    	let div5;
    	let div2;
    	let t5;
    	let input1;
    	let updating_bindvalue;
    	let t6;
    	let div3;
    	let t8;
    	let textarea;
    	let t9;
    	let div4;
    	let button0;
    	let t10;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (!/*showImage*/ ctx[3]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	function input1_bindvalue_binding(value) {
    		/*input1_bindvalue_binding*/ ctx[12](value);
    	}

    	let input1_props = {
    		maxlength: "20",
    		size: "50",
    		placeholder: "Name"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input1_props.bindvalue = /*name*/ ctx[0];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'bindvalue', input1_bindvalue_binding));

    	button0 = new Button({
    			props: {
    				width: "7rem",
    				height: "2.5rem",
    				backgroundColor: "var(--main-green-color)",
    				onClick: /*Save*/ ctx[6],
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
    				onClick: /*Cancel*/ ctx[7],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			if_block.c();
    			t0 = space();
    			label = element("label");
    			div0 = element("div");
    			div0.textContent = "EDIT";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div2.textContent = "Name";
    			t5 = space();
    			create_component(input1.$$.fragment);
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = "Bio";
    			t8 = space();
    			textarea = element("textarea");
    			t9 = space();
    			div4 = element("div");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div0, "class", "btn__text svelte-79y5ho");
    			add_location(div0, file_1, 100, 20, 2883);
    			attr_dev(label, "class", "btn__input_image svelte-79y5ho");
    			attr_dev(label, "for", "input-file");
    			add_location(label, file_1, 99, 16, 2813);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", ".jpg,.png,.jpeg");
    			attr_dev(input0, "id", "input-file");
    			set_style(input0, "display", "none");
    			add_location(input0, file_1, 102, 16, 2956);
    			attr_dev(div1, "class", "div__column svelte-79y5ho");
    			add_location(div1, file_1, 93, 12, 2465);
    			attr_dev(div2, "class", "text svelte-79y5ho");
    			add_location(div2, file_1, 106, 16, 3153);
    			attr_dev(div3, "class", "text svelte-79y5ho");
    			add_location(div3, file_1, 109, 16, 3284);
    			attr_dev(textarea, "placeholder", "Add a bio");
    			attr_dev(textarea, "class", "svelte-79y5ho");
    			add_location(textarea, file_1, 110, 16, 3326);
    			attr_dev(div4, "class", "btn__div svelte-79y5ho");
    			add_location(div4, file_1, 112, 16, 3406);
    			attr_dev(div5, "class", "div__column svelte-79y5ho");
    			add_location(div5, file_1, 105, 12, 3111);
    			attr_dev(div6, "class", "div__row svelte-79y5ho");
    			add_location(div6, file_1, 92, 8, 2430);
    			attr_dev(div7, "class", "div svelte-79y5ho");
    			add_location(div7, file_1, 91, 4, 2404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, label);
    			append_dev(label, div0);
    			append_dev(div1, t2);
    			append_dev(div1, input0);
    			/*input0_binding*/ ctx[11](input0);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div5, t5);
    			mount_component(input1, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, textarea);
    			set_input_value(textarea, /*bio*/ ctx[1]);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			mount_component(button0, div4, null);
    			append_dev(div4, t10);
    			mount_component(button1, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*onChange*/ ctx[9], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			}

    			const input1_changes = {};

    			if (!updating_bindvalue && dirty & /*name*/ 1) {
    				updating_bindvalue = true;
    				input1_changes.bindvalue = /*name*/ ctx[0];
    				add_flush_callback(() => updating_bindvalue = false);
    			}

    			input1.$set(input1_changes);

    			if (dirty & /*bio*/ 2) {
    				set_input_value(textarea, /*bio*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if_block.d();
    			/*input0_binding*/ ctx[11](null);
    			destroy_component(input1);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(91:0) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (97:16) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Preview");
    			attr_dev(img, "class", "content__profileImg svelte-79y5ho");
    			add_location(img, file_1, 97, 20, 2700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			/*img_binding*/ ctx[10](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			/*img_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(97:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (95:16) {#if !showImage}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*$user*/ ctx[5].profileImg || GIT_URL + '/' + /*$user*/ ctx[5].githubId + '.png')) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "content__profileImg svelte-79y5ho");
    			add_location(img, file_1, 95, 20, 2544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$user*/ 32 && !src_url_equal(img.src, img_src_value = /*$user*/ ctx[5].profileImg || GIT_URL + '/' + /*$user*/ ctx[5].githubId + '.png')) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(95:16) {#if !showImage}",
    		ctx
    	});

    	return block;
    }

    // (114:20) <Button                          width='7rem'                         height='2.5rem'                         backgroundColor='var(--main-green-color)'                         onClick={Save}                     >
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Save";
    			attr_dev(div, "class", "btn__text svelte-79y5ho");
    			add_location(div, file_1, 119, 24, 3687);
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
    		source: "(114:20) <Button                          width='7rem'                         height='2.5rem'                         backgroundColor='var(--main-green-color)'                         onClick={Save}                     >",
    		ctx
    	});

    	return block;
    }

    // (122:20) <Button                          width='7rem'                         height='2.5rem'                         backgroundColor='#E3E3E3'                         onClick={Cancel}                     >
    function create_default_slot$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cancel";
    			attr_dev(div, "class", "btn__text svelte-79y5ho");
    			add_location(div, file_1, 127, 24, 3993);
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
    		source: "(122:20) <Button                          width='7rem'                         height='2.5rem'                         backgroundColor='#E3E3E3'                         onClick={Cancel}                     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let globalnavigationbar;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	globalnavigationbar = new GlobalNavigationBar({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(globalnavigationbar.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalnavigationbar, target, anchor);
    			insert_dev(target, t, anchor);
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
    			transition_in(globalnavigationbar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalnavigationbar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalnavigationbar, detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function checkFileType(element) {
    	const accept_type = ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    	if (accept_type.includes(element)) return true; else return false;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditProfile', slots, []);
    	let name = '';
    	let bio = "";
    	let input;
    	let showImage = false;
    	let image;
    	let file;

    	onMount(() => {
    		if ($user) {
    			$$invalidate(0, name = $user.username);
    			$$invalidate(1, bio = $user.bio);
    		}
    	});

    	async function Save() {
    		let body_data;

    		if (file) {
    			let form_data = new FormData();
    			form_data.append('file', file);
    			let photo_url = await fetchPostFormData('image', form_data);

    			body_data = {
    				username: name,
    				bio,
    				profileImg: photo_url.url
    			};
    		} else {
    			body_data = {
    				username: name,
    				bio,
    				profileImg: $user.profileImg
    			};
    		}

    		await fetchPatch('users', body_data);
    		getUser();
    		alert("수정되었습니다.");
    		push$1('/');
    	}

    	function Cancel() {
    		alert("취소되었습니다.");
    		push$1('/');
    	}

    	function refuseEnter() {
    		alert("로그인 이후 접근 가능한 페이지입니다.");
    		push$1('/login');
    	}

    	function onChange() {
    		if (!input.files[0]) return;
    		let name_arr = input.files[0].name.split('.');

    		if (!checkFileType(name_arr[name_arr.length - 1])) {
    			alert('지원하지 않는 파일 형식입니다.\n지원파일타입: .jpg .png .jpeg');
    			return;
    		}

    		file = input.files[0];

    		if (file) {
    			$$invalidate(3, showImage = true);
    			const reader = new FileReader();

    			reader.addEventListener("load", function () {
    				image.setAttribute("src", reader.result);
    			});

    			reader.readAsDataURL(file);
    			return;
    		}

    		$$invalidate(3, showImage = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditProfile> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			image = $$value;
    			$$invalidate(4, image);
    		});
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function input1_bindvalue_binding(value) {
    		name = value;
    		$$invalidate(0, name);
    	}

    	function textarea_input_handler() {
    		bio = this.value;
    		$$invalidate(1, bio);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		push: push$1,
    		pop,
    		Button,
    		Input,
    		GlobalNavigationBar,
    		user,
    		getUser,
    		notifications,
    		GIT_URL,
    		fetchPostFormData,
    		fetchPatch,
    		name,
    		bio,
    		input,
    		showImage,
    		image,
    		file,
    		Save,
    		Cancel,
    		refuseEnter,
    		checkFileType,
    		onChange,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('bio' in $$props) $$invalidate(1, bio = $$props.bio);
    		if ('input' in $$props) $$invalidate(2, input = $$props.input);
    		if ('showImage' in $$props) $$invalidate(3, showImage = $$props.showImage);
    		if ('image' in $$props) $$invalidate(4, image = $$props.image);
    		if ('file' in $$props) file = $$props.file;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		bio,
    		input,
    		showImage,
    		image,
    		$user,
    		Save,
    		Cancel,
    		refuseEnter,
    		onChange,
    		img_binding,
    		input0_binding,
    		input1_bindvalue_binding,
    		textarea_input_handler
    	];
    }

    class EditProfile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditProfile",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/RedirectPage.svelte generated by Svelte v3.46.3 */
    const file$2 = "src/pages/RedirectPage.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			add_location(div, file$2, 6, 0, 85);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RedirectPage', slots, []);
    	setUserToken();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RedirectPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ setUserToken });
    	return [];
    }

    class RedirectPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RedirectPage",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/NotFound.svelte generated by Svelte v3.46.3 */
    const file$1 = "src/pages/NotFound.svelte";

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
    			t3 = text("\n\t\t요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.");
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(span0, "class", "NotFound__head svelte-1xudf5y");
    			add_location(span0, file$1, 10, 1, 166);
    			add_location(br, file$1, 12, 17, 253);
    			attr_dev(span1, "class", "NotFound__sub svelte-1xudf5y");
    			add_location(span1, file$1, 11, 1, 207);
    			attr_dev(div, "class", "NotFound svelte-1xudf5y");
    			add_location(div, file$1, 9, 0, 142);
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
    		push$1('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ push: push$1, Button, onClick });
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
    	'/edit_profile' : EditProfile,
    	'/redirect': RedirectPage,
    	'*': NotFound,
    };

    /* src/App.svelte generated by Svelte v3.46.3 */
    const file = "src/App.svelte";

    // (13:2) <Container>
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
    		source: "(13:2) <Container>",
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
    	let chatbutton;
    	let t2;
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

    	chatbutton = new ChatButton({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(container.$$.fragment);
    			t1 = space();
    			create_component(chatbutton.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "body svelte-fvo70l");
    			add_location(div, file, 11, 1, 348);
    			set_style(main, "height", "100%");
    			add_location(main, file, 9, 0, 307);
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
    			mount_component(chatbutton, main, null);
    			append_dev(main, t2);
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
    			transition_in(chatbutton.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(container.$$.fragment, local);
    			transition_out(chatbutton.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(container);
    			destroy_component(chatbutton);
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
    		ChatButton,
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
