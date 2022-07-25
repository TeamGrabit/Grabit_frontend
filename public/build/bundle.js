
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

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (251:0) {:else}
    function create_else_block$8(ctx) {
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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$b(ctx) {
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$8];
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
    		id: create_fragment$w.name,
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

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
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

    function instance$w($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
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
    		location: location$1,
    		querystring,
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

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$w.name
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
    const API_URL = "https://grabit-backend.link/api";
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

    	try{
    		const res = await fetch(url, options);
    		data = await res.json();
    	} catch(error) {
    		data = { err: error.name, errMsg: error.message };
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

    const user = writable();

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

    /* src\storybook\Button.svelte generated by Svelte v3.46.3 */

    const file$u = "src\\storybook\\Button.svelte";

    function create_fragment$v(ctx) {
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
    			add_location(button, file$u, 8, 0, 136);
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
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
    			id: create_fragment$v.name
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

    /* src\storybook\Dropdown.svelte generated by Svelte v3.46.3 */
    const file$t = "src\\storybook\\Dropdown.svelte";

    // (24:0) {#if open}
    function create_if_block$a(ctx) {
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
    			add_location(div, file$t, 24, 1, 482);
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(24:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && create_if_block$a(ctx);

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
    					if_block = create_if_block$a(ctx);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { onClickOut: 2, open: 0, right: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$u.name
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

    const file$s = "src\\storybook\\DropdownItem.svelte";

    function create_fragment$t(ctx) {
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
    			add_location(div, file$s, 4, 0, 45);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownItem",
    			options,
    			id: create_fragment$t.name
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

    /* src\storybook\SearchInput.svelte generated by Svelte v3.46.3 */

    const file$r = "src\\storybook\\SearchInput.svelte";

    function create_fragment$s(ctx) {
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
    			add_location(input, file$r, 10, 4, 198);
    			attr_dev(img, "class", "search__icon svelte-1bs1bc9");
    			if (!src_url_equal(img.src, img_src_value = "images/search.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "search_img");
    			add_location(img, file$r, 16, 4, 338);
    			attr_dev(div, "class", "search svelte-1bs1bc9");
    			add_location(div, file$r, 9, 0, 172);
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
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3])
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInput', slots, []);
    	let { searchHandler } = $$props;
    	let searchVal = "";

    	const onKeyPress = e => {
    		if (e.charCode === 13) searchHandler(searchVal);
    	};

    	const writable_props = ['searchHandler'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchVal = this.value;
    		$$invalidate(0, searchVal);
    	}

    	$$self.$$set = $$props => {
    		if ('searchHandler' in $$props) $$invalidate(2, searchHandler = $$props.searchHandler);
    	};

    	$$self.$capture_state = () => ({ searchHandler, searchVal, onKeyPress });

    	$$self.$inject_state = $$props => {
    		if ('searchHandler' in $$props) $$invalidate(2, searchHandler = $$props.searchHandler);
    		if ('searchVal' in $$props) $$invalidate(0, searchVal = $$props.searchVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchVal, onKeyPress, searchHandler, input_input_handler];
    }

    class SearchInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { searchHandler: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInput",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*searchHandler*/ ctx[2] === undefined && !('searchHandler' in props)) {
    			console.warn("<SearchInput> was created without expected prop 'searchHandler'");
    		}
    	}

    	get searchHandler() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchHandler(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\storybook\Input.svelte generated by Svelte v3.46.3 */

    const file$q = "src\\storybook\\Input.svelte";

    function create_fragment$r(ctx) {
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
    			add_location(input, file$q, 7, 0, 116);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			bindvalue: 0,
    			size: 1,
    			maxlength: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$r.name
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

    /* src\storybook\Loader.svelte generated by Svelte v3.46.3 */

    const file$p = "src\\storybook\\Loader.svelte";

    function create_fragment$q(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "Loader svelte-s36wix");
    			set_style(div, "--color", /*color*/ ctx[0] || 'var(--main-green-darker-color)');
    			add_location(div, file$p, 4, 0, 43);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$q.name
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

    /* src\storybook\SubNavigation.svelte generated by Svelte v3.46.3 */

    const file$o = "src\\storybook\\SubNavigation.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "SubNavigation svelte-zt0xir");
    			add_location(div, file$o, 3, 0, 23);
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigation",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\storybook\SubNavigationItem.svelte generated by Svelte v3.46.3 */
    const file$n = "src\\storybook\\SubNavigationItem.svelte";

    // (14:1) {#if isActive}
    function create_if_block$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "SubNavigationItem__active svelte-1697sdr");
    			add_location(div, file$n, 14, 2, 314);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(14:1) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isActive*/ ctx[1] && create_if_block$9(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "SubNavigationItem " + /*activeCss*/ ctx[2] + " svelte-1697sdr");
    			add_location(div, file$n, 12, 0, 231);
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
    					if_block = create_if_block$9(ctx);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { onClick: 0, isActive: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubNavigationItem",
    			options,
    			id: create_fragment$o.name
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

    /* src\storybook\Card.svelte generated by Svelte v3.46.3 */

    const file$m = "src\\storybook\\Card.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Card svelte-m3r2mx");
    			add_location(div, file$m, 3, 0, 23);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.46.3 */
    const file$l = "src\\components\\Header.svelte";

    // (47:2) {:else}
    function create_else_block$7(ctx) {
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
    			add_location(img, file$l, 48, 4, 1323);
    			attr_dev(span, "class", "header__profile svelte-15ml67a");
    			add_location(span, file$l, 47, 3, 1287);
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

    			if (dirty & /*$$scope*/ 256) {
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(47:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if $user}
    function create_if_block$8(ctx) {
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
    			if (!src_url_equal(img.src, img_src_value = /*checkProfileImage*/ ctx[4]())) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "header__profile__img svelte-15ml67a");
    			add_location(img, file$l, 35, 4, 942);
    			attr_dev(span, "class", "header__profile svelte-15ml67a");
    			add_location(span, file$l, 34, 3, 906);
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

    			if (dirty & /*$$scope*/ 256) {
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(34:2) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (56:5) <DropdownItem onClick={()=>{push('/login')}}>
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
    		source: "(56:5) <DropdownItem onClick={()=>{push('/login')}}>",
    		ctx
    	});

    	return block;
    }

    // (55:4) <Dropdown open={isOpenDropdown} {onClickOut} right>
    function create_default_slot_3(ctx) {
    	let dropdownitem;
    	let current;

    	dropdownitem = new DropdownItem({
    			props: {
    				onClick: /*func*/ ctx[6],
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

    			if (dirty & /*$$scope*/ 256) {
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
    		source: "(55:4) <Dropdown open={isOpenDropdown} {onClickOut} right>",
    		ctx
    	});

    	return block;
    }

    // (43:5) <DropdownItem onClick=''>
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
    		source: "(43:5) <DropdownItem onClick=''>",
    		ctx
    	});

    	return block;
    }

    // (44:5) <DropdownItem onClick={logout}>
    function create_default_slot_1$7(ctx) {
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
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(44:5) <DropdownItem onClick={logout}>",
    		ctx
    	});

    	return block;
    }

    // (42:4) <Dropdown open={isOpenDropdown} {onClickOut} right>
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
    				$$slots: { default: [create_default_slot_1$7] },
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

    			if (dirty & /*$$scope*/ 256) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
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
    		source: "(42:4) <Dropdown open={isOpenDropdown} {onClickOut} right>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
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
    	const if_block_creators = [create_if_block$8, create_else_block$7];
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
    			add_location(img, file$l, 28, 3, 748);
    			attr_dev(div0, "class", "header__title svelte-15ml67a");
    			add_location(div0, file$l, 29, 3, 826);
    			attr_dev(div1, "class", "header__logo svelte-15ml67a");
    			add_location(div1, file$l, 27, 2, 690);
    			attr_dev(div2, "class", "header__container svelte-15ml67a");
    			add_location(div2, file$l, 26, 1, 655);
    			attr_dev(div3, "class", "header svelte-15ml67a");
    			add_location(div3, file$l, 25, 0, 632);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const name = "Grabit";

    function instance$m($$self, $$props, $$invalidate) {
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

    	const checkProfileImage = () => {
    		if ($user.profileImg) return $user.profileImg;
    		return GIT_URL + '/' + $user.githubId + '.png';
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
    		checkProfileImage,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) src = $$props.src;
    		if ('isOpenDropdown' in $$props) $$invalidate(0, isOpenDropdown = $$props.isOpenDropdown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpenDropdown,
    		$user,
    		onClickProfile,
    		onClickOut,
    		checkProfileImage,
    		click_handler,
    		func
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.46.3 */

    const file$k = "src\\components\\Footer.svelte";

    function create_fragment$l(ctx) {
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
    			add_location(img, file$k, 6, 3, 106);
    			attr_dev(div0, "class", "footer_title svelte-un0msu");
    			add_location(div0, file$k, 7, 3, 175);
    			attr_dev(div1, "class", "footer_logo svelte-un0msu");
    			add_location(div1, file$k, 5, 2, 76);
    			attr_dev(div2, "class", "menu_text svelte-un0msu");
    			add_location(div2, file$k, 10, 3, 267);
    			attr_dev(div3, "class", "menu_text svelte-un0msu");
    			add_location(div3, file$k, 11, 3, 306);
    			attr_dev(div4, "class", "menu_text svelte-un0msu");
    			add_location(div4, file$k, 12, 3, 344);
    			attr_dev(div5, "class", "menu_text svelte-un0msu");
    			add_location(div5, file$k, 13, 3, 386);
    			attr_dev(div6, "class", "footer_menu svelte-un0msu");
    			add_location(div6, file$k, 9, 2, 237);
    			attr_dev(div7, "class", "footer_inner svelte-un0msu");
    			add_location(div7, file$k, 4, 1, 46);
    			attr_dev(div8, "class", "footer svelte-un0msu");
    			add_location(div8, file$k, 3, 0, 23);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props) {
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\Container.svelte generated by Svelte v3.46.3 */

    const file$j = "src\\components\\Container.svelte";

    function create_fragment$k(ctx) {
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
    			add_location(div0, file$j, 5, 1, 59);
    			attr_dev(div1, "class", "container_outside svelte-40xe32");
    			add_location(div1, file$j, 4, 0, 25);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
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

    /* src\components\GlobalNavigationBar.svelte generated by Svelte v3.46.3 */
    const file$i = "src\\components\\GlobalNavigationBar.svelte";

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
    			t0 = text("My Challenges\r\n\t\t");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			t2 = text("View Other Challenges\r\n\t\t");
    			div2 = element("div");
    			attr_dev(div0, "class", "bar svelte-1smd1ck");
    			add_location(div0, file$i, 25, 2, 580);
    			attr_dev(div1, "class", div1_class_value = "gnb_menu " + /*classNames*/ ctx[0][0] + " svelte-1smd1ck");
    			add_location(div1, file$i, 23, 1, 500);
    			attr_dev(div2, "class", "bar svelte-1smd1ck");
    			add_location(div2, file$i, 29, 2, 702);
    			attr_dev(div3, "class", div3_class_value = "gnb_menu " + /*classNames*/ ctx[0][1] + " svelte-1smd1ck");
    			add_location(div3, file$i, 27, 1, 611);
    			attr_dev(div4, "class", "gnb svelte-1smd1ck");
    			add_location(div4, file$i, 22, 0, 480);
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

    /* src\components\Profile.svelte generated by Svelte v3.46.3 */
    const file$h = "src\\components\\Profile.svelte";

    // (27:1) {:else}
    function create_else_block$6(ctx) {
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
    			add_location(img, file$h, 27, 2, 685);
    			attr_dev(div, "class", "profile__id svelte-gid2k0");
    			add_location(div, file$h, 28, 2, 776);
    			add_location(p, file$h, 30, 3, 870);
    			attr_dev(button, "class", "edit_btn svelte-gid2k0");
    			add_location(button, file$h, 29, 2, 816);
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(27:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:1) {#if $user}
    function create_if_block$7(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t1_value = /*$user*/ ctx[0].username + "";
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
    			if (!src_url_equal(img.src, img_src_value = /*checkProfileImage*/ ctx[3]())) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "profile__img svelte-gid2k0");
    			add_location(img, file$h, 21, 3, 452);
    			attr_dev(div, "class", "profile__id svelte-gid2k0");
    			add_location(div, file$h, 22, 2, 528);
    			add_location(p, file$h, 24, 3, 639);
    			attr_dev(button, "class", "edit_btn svelte-gid2k0");
    			add_location(button, file$h, 23, 2, 579);
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
    			if (dirty & /*$user*/ 1 && t1_value !== (t1_value = /*$user*/ ctx[0].username + "")) set_data_dev(t1, t1_value);
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
    		source: "(21:1) {#if $user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[0]) return create_if_block$7;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "profile svelte-gid2k0");
    			add_location(div, file$h, 19, 0, 412);
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

    	const checkProfileImage = () => {
    		if ($user.profileImg) return $user.profileImg;
    		return GIT_URL + '/' + $user.githubId + '.png';
    	};

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
    		checkProfileImage,
    		$user
    	});

    	return [$user, onClickEditProfile, onClickLogin, checkProfileImage];
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

    /* src\components\Grass.svelte generated by Svelte v3.46.3 */

    const file$g = "src\\components\\Grass.svelte";

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
    			add_location(p, file$g, 24, 1, 590);
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
    			add_location(div, file$g, 7, 0, 131);
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
    function create_else_block$5(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*grass*/ ctx[4].count < 9) return create_if_block_2$1;
    		return create_else_block_1$1;
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
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if isBig}
    function create_if_block_1$5(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count * /*color_level*/ ctx[3] / /*group_num*/ ctx[2]) + " svelte-197ht8d");
    			add_location(div, file$g, 11, 3, 253);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(10:2) {#if isBig}",
    		ctx
    	});

    	return block;
    }

    // (17:3) {:else}
    function create_else_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "grass grass_4 svelte-197ht8d");
    			add_location(div, file$g, 18, 4, 512);
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
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(17:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:3) {#if grass.count < 9}
    function create_if_block_2$1(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "grass grass_" + Math.ceil(/*grass*/ ctx[4].count / 2) + " svelte-197ht8d");
    			add_location(div, file$g, 15, 4, 396);
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
    		id: create_if_block_2$1.name,
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
    		if (/*isBig*/ ctx[1]) return create_if_block_1$5;
    		return create_else_block$5;
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

    async function getUserChallenge() {
    	const res = await fetchGet(`users/challenge`);
    	return res;
    }

    async function joinChallenge( challenge_id ) {
    	const res = await fetchPatch(`challenges/${challenge_id}/join`);
    	return res;
    }

    function getApproveList(groupId) {
    	// TODO: api 나오면 연결하기
    	return [
    		{
    			requestId: 1,
    			name: 'tnghd5761',
    			message: '같이 해요 :)같이 해요 :)같이 해요 :)같이 해요 :)'
    		},
    		{
    			requestId: 2,
    			name: 'llJTOll',
    			message: '같이 해요 :)'
    		},
    		{
    			requestId: 2,
    			name: 'MOBUMIN',
    			message: '같이 해요 :)'
    		}
    	]
    }

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

    /* src\pages\Home.svelte generated by Svelte v3.46.3 */
    const file$f = "src\\pages\\Home.svelte";

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
    			add_location(div0, file$f, 34, 6, 1117);
    			attr_dev(div1, "class", "box_intro svelte-x06cgc");
    			add_location(div1, file$f, 35, 6, 1223);
    			attr_dev(div2, "class", "challenge_box svelte-x06cgc");
    			add_location(div2, file$f, 33, 5, 1082);
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
    			add_location(div0, file$f, 30, 3, 961);
    			attr_dev(div1, "class", "box_container svelte-x06cgc");
    			add_location(div1, file$f, 31, 3, 1007);
    			attr_dev(div2, "class", "pinned");
    			add_location(div2, file$f, 29, 2, 936);
    			attr_dev(div3, "class", "content_title svelte-x06cgc");
    			add_location(div3, file$f, 41, 3, 1350);
    			attr_dev(div4, "class", "grass");
    			add_location(div4, file$f, 40, 2, 1326);
    			attr_dev(div5, "class", "content svelte-x06cgc");
    			add_location(div5, file$f, 28, 1, 911);
    			attr_dev(div6, "class", "overview svelte-x06cgc");
    			add_location(div6, file$f, 26, 0, 872);
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

    /* src\pages\Login.svelte generated by Svelte v3.46.3 */
    const file$e = "src\\pages\\Login.svelte";

    // (8:1) <Button    width='15rem'    height='2.5rem'    backgroundColor='var(--main-white-color)'    onClick={login}   >
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
    			add_location(img, file$e, 14, 3, 343);
    			add_location(span0, file$e, 15, 3, 413);
    			attr_dev(span1, "class", "Login__slot svelte-14uycgs");
    			add_location(span1, file$e, 13, 2, 312);
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
    		source: "(8:1) <Button    width='15rem'    height='2.5rem'    backgroundColor='var(--main-white-color)'    onClick={login}   >",
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
    			add_location(img, file$e, 6, 1, 127);
    			attr_dev(div, "class", "Login svelte-14uycgs");
    			add_location(div, file$e, 5, 0, 105);
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

    /* src\components\Toast.svelte generated by Svelte v3.46.3 */
    const file$d = "src\\components\\Toast.svelte";

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
    			add_location(div0, file$d, 19, 12, 581);
    			attr_dev(img, "class", "notifications__toast__button svelte-ofcv3b");
    			if (!src_url_equal(img.src, img_src_value = "images/x-mark.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "x-mark");
    			add_location(img, file$d, 20, 12, 666);
    			attr_dev(div1, "class", "notifications__toast svelte-ofcv3b");
    			add_location(div1, file$d, 13, 8, 383);
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
    			add_location(div, file$d, 11, 0, 277);
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

    /* src\components\SettingChallenge.svelte generated by Svelte v3.46.3 */

    const file$c = "src\\components\\SettingChallenge.svelte";

    // (40:0) {#if isActive}
    function create_if_block$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
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
    		source: "(40:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (43:1) {:else}
    function create_else_block$4(ctx) {
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
    				$$slots: { default: [create_default_slot_1$6] },
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
    			add_location(div0, file$c, 46, 4, 1168);
    			attr_dev(div1, "class", "text svelte-1j99ca0");
    			add_location(div1, file$c, 48, 5, 1235);
    			add_location(span, file$c, 49, 5, 1278);
    			attr_dev(div2, "class", "text svelte-1j99ca0");
    			add_location(div2, file$c, 53, 5, 1371);
    			attr_dev(div3, "class", "sub_content svelte-1j99ca0");
    			add_location(div3, file$c, 47, 4, 1205);
    			attr_dev(hr0, "align", "left");
    			attr_dev(hr0, "class", "hr svelte-1j99ca0");
    			add_location(hr0, file$c, 57, 4, 1476);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "secure");
    			input2.__value = "public";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input2);
    			add_location(input2, file$c, 60, 6, 1565);
    			attr_dev(img0, "class", "image svelte-1j99ca0");
    			if (!src_url_equal(img0.src, img0_src_value = "images/public.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "public_img");
    			add_location(img0, file$c, 61, 6, 1642);
    			attr_dev(div4, "class", "small_text svelte-1j99ca0");
    			add_location(div4, file$c, 63, 7, 1726);
    			attr_dev(div5, "class", "explain_text svelte-1j99ca0");
    			add_location(div5, file$c, 64, 7, 1769);
    			add_location(div6, file$c, 62, 6, 1712);
    			attr_dev(div7, "class", "contain svelte-1j99ca0");
    			add_location(div7, file$c, 59, 5, 1538);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "secure");
    			attr_dev(input3, "align", "middle");
    			input3.__value = "private";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[11][0].push(input3);
    			add_location(input3, file$c, 69, 6, 1908);
    			attr_dev(img1, "class", "image svelte-1j99ca0");
    			if (!src_url_equal(img1.src, img1_src_value = "images/private.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "private_img");
    			add_location(img1, file$c, 70, 6, 2001);
    			attr_dev(div8, "class", "small_text svelte-1j99ca0");
    			add_location(div8, file$c, 72, 7, 2087);
    			attr_dev(div9, "class", "explain_text svelte-1j99ca0");
    			add_location(div9, file$c, 73, 7, 2131);
    			add_location(div10, file$c, 71, 6, 2073);
    			attr_dev(div11, "class", "contain svelte-1j99ca0");
    			add_location(div11, file$c, 68, 5, 1881);
    			attr_dev(div12, "class", "sub_content svelte-1j99ca0");
    			add_location(div12, file$c, 58, 4, 1508);
    			attr_dev(hr1, "align", "left");
    			attr_dev(hr1, "class", "hr svelte-1j99ca0");
    			add_location(hr1, file$c, 77, 4, 2256);
    			attr_dev(div13, "class", "sub_content button_group svelte-1j99ca0");
    			add_location(div13, file$c, 78, 4, 2288);
    			attr_dev(div14, "class", "content svelte-1j99ca0");
    			add_location(div14, file$c, 45, 3, 1141);
    			attr_dev(div15, "class", "page svelte-1j99ca0");
    			add_location(div15, file$c, 44, 2, 1118);
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

    			if (dirty & /*$$scope*/ 8192) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:1) {#if !challengeData}
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
    		source: "(41:1) {#if !challengeData}",
    		ctx
    	});

    	return block;
    }

    // (80:5) <Button         width='8rem'        height='2.5rem'        backgroundColor='var(--main-green-color)'        onClick={onClickSave}       >
    function create_default_slot_1$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Save";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$c, 85, 6, 2479);
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
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(80:5) <Button         width='8rem'        height='2.5rem'        backgroundColor='var(--main-green-color)'        onClick={onClickSave}       >",
    		ctx
    	});

    	return block;
    }

    // (89:5) <Button         width='8rem'        height='2.5rem'        backgroundColor='#FAE5E5'        onClick={onClickDelete}       >
    function create_default_slot$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Delete";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$c, 94, 6, 2669);
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
    		source: "(89:5) <Button         width='8rem'        height='2.5rem'        backgroundColor='#FAE5E5'        onClick={onClickDelete}       >",
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

    	onMount(async () => {
    		$$invalidate(1, challengeData = await getChallenge(params.id));
    		$$invalidate(2, name = challengeData.name);
    		$$invalidate(3, description = challengeData.description);
    		$$invalidate(4, secure = challengeData.isPrivate ? 'private' : 'public');
    	});

    	const onClickSave = () => {
    		const isPrivate = secure === 'private';

    		editChallenge(params.id, { name, description, isPrivate }).then(() => {
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

    /* src\components\ApproveMember.svelte generated by Svelte v3.46.3 */
    const file$b = "src\\components\\ApproveMember.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (17:0) {#if isActive}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
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
    		source: "(17:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (20:1) {:else}
    function create_else_block$3(ctx) {
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
    			add_location(div0, file$b, 21, 3, 444);
    			attr_dev(div1, "class", "Card svelte-1a12pbs");
    			add_location(div1, file$b, 20, 2, 421);
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
    			if (dirty & /*CardList, GIT_URL*/ 2) {
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(20:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:1) {#if !CardList}
    function create_if_block_1$3(ctx) {
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(18:1) {#if !CardList}",
    		ctx
    	});

    	return block;
    }

    // (36:8) <Button           width='2rem'           height='2rem'           backgroundColor='var(--main-green-color)'           style='padding: 0;'          >
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "Card__button__image svelte-1a12pbs");
    			attr_dev(img, "alt", "Check");
    			add_location(img, file$b, 41, 9, 1048);
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
    		source: "(36:8) <Button           width='2rem'           height='2rem'           backgroundColor='var(--main-green-color)'           style='padding: 0;'          >",
    		ctx
    	});

    	return block;
    }

    // (44:8) <Button           width='2rem'           height='2rem'           backgroundColor='#FAE5E5'           style='padding: 0;'          >
    function create_default_slot_1$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/x.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "Card__button__image svelte-1a12pbs");
    			attr_dev(img, "alt", "Reject");
    			add_location(img, file$b, 49, 9, 1287);
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(44:8) <Button           width='2rem'           height='2rem'           backgroundColor='#FAE5E5'           style='padding: 0;'          >",
    		ctx
    	});

    	return block;
    }

    // (24:5) <Card>
    function create_default_slot$9(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h3;
    	let t1_value = /*card*/ ctx[3].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*card*/ ctx[3].message + "";
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
    				$$slots: { default: [create_default_slot_1$5] },
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
    			if (!src_url_equal(img.src, img_src_value = "" + (GIT_URL + "/" + /*card*/ ctx[3].name + ".png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "Card__profile svelte-1a12pbs");
    			add_location(img, file$b, 25, 7, 552);
    			attr_dev(h3, "class", "Card__body__head Card__body--ellipsis svelte-1a12pbs");
    			add_location(h3, file$b, 27, 8, 683);
    			attr_dev(p, "class", "Card__body--ellipsis svelte-1a12pbs");
    			add_location(p, file$b, 30, 8, 780);
    			attr_dev(div0, "class", "Card__body__content svelte-1a12pbs");
    			add_location(div0, file$b, 26, 7, 640);
    			add_location(div1, file$b, 34, 7, 875);
    			attr_dev(div2, "class", "Card__body svelte-1a12pbs");
    			add_location(div2, file$b, 24, 6, 519);
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
    			if (!current || dirty & /*CardList*/ 2 && !src_url_equal(img.src, img_src_value = "" + (GIT_URL + "/" + /*card*/ ctx[3].name + ".png"))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*CardList*/ 2) && t1_value !== (t1_value = /*card*/ ctx[3].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*CardList*/ 2) && t3_value !== (t3_value = /*card*/ ctx[3].message + "")) set_data_dev(t3, t3_value);
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
    		source: "(24:5) <Card>",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#each CardList as card}
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

    			if (dirty & /*$$scope, CardList*/ 66) {
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
    		source: "(23:4) {#each CardList as card}",
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
    		// TODO: API 연결
    		$$invalidate(1, CardList = getApproveList());
    	});

    	const writable_props = ['params', 'isActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApproveMember> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Card,
    		Loader,
    		Button,
    		getApproveList,
    		GIT_URL,
    		params,
    		isActive,
    		CardList
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    		if ('CardList' in $$props) $$invalidate(1, CardList = $$props.CardList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isActive, CardList, params];
    }

    class ApproveMember extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { params: 2, isActive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApproveMember",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[2] === undefined && !('params' in props)) {
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

    /* src\pages\Setting.svelte generated by Svelte v3.46.3 */
    const file$a = "src\\pages\\Setting.svelte";

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
    function create_default_slot_1$4(ctx) {
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
    		id: create_default_slot_1$4.name,
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
    				$$slots: { default: [create_default_slot_1$4] },
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
    			add_location(div, file$a, 21, 0, 637);
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

    /* src\components\CommitRequest.svelte generated by Svelte v3.46.3 */
    const file$9 = "src\\components\\CommitRequest.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (17:6) <Button         width='5rem'         height='2rem'         backgroundColor='#B8FFC8'        >
    function create_default_slot_1$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "승인";
    			attr_dev(div, "class", "btn_txt svelte-2z0tw0");
    			add_location(div, file$9, 21, 7, 592);
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
    		source: "(17:6) <Button         width='5rem'         height='2rem'         backgroundColor='#B8FFC8'        >",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Button         width='5rem'         height='2rem'         backgroundColor='#FFB8B4'        >
    function create_default_slot$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "반려";
    			attr_dev(div, "class", "btn_txt svelte-2z0tw0");
    			add_location(div, file$9, 29, 7, 810);
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
    		source: "(25:6) <Button         width='5rem'         height='2rem'         backgroundColor='#FFB8B4'        >",
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
    				$$slots: { default: [create_default_slot_1$3] },
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
    			add_location(div0, file$9, 11, 4, 261);
    			attr_dev(div1, "class", "req_box_requester svelte-2z0tw0");
    			add_location(div1, file$9, 12, 4, 309);
    			attr_dev(div2, "class", "approver svelte-2z0tw0");
    			add_location(div2, file$9, 14, 5, 399);
    			set_style(span, "display", "inline-block");
    			set_style(span, "width", "0.05rem");
    			add_location(span, file$9, 23, 6, 646);
    			add_location(div3, file$9, 15, 5, 477);
    			attr_dev(div4, "class", "req_box_btn svelte-2z0tw0");
    			add_location(div4, file$9, 13, 4, 367);
    			attr_dev(div5, "class", "req_box svelte-2z0tw0");
    			add_location(div5, file$9, 10, 3, 234);
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
    			add_location(p, file$9, 7, 1, 142);
    			attr_dev(div0, "class", "admit_req_box svelte-2z0tw0");
    			add_location(div0, file$9, 8, 1, 175);
    			attr_dev(div1, "class", "admit_req svelte-2z0tw0");
    			add_location(div1, file$9, 6, 0, 116);
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

    /* src\pages\ChallengeDetail.svelte generated by Svelte v3.46.3 */
    const file$8 = "src\\pages\\ChallengeDetail.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (49:1) {#if !group.includes($user.githubId)}
    function create_if_block$3(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				width: "5rem",
    				height: "2rem",
    				backgroundColor: "#B8FFC8",
    				onClick: joinChallenge(/*params*/ ctx[0].id),
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "join");
    			add_location(div, file$8, 49, 2, 1729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*params*/ 1) button_changes.onClick = joinChallenge(/*params*/ ctx[0].id);

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:1) {#if !group.includes($user.githubId)}",
    		ctx
    	});

    	return block;
    }

    // (51:3) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinChallenge(params.id)}     >
    function create_default_slot$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "JOIN";
    			attr_dev(div, "class", "btn_txt");
    			add_location(div, file$8, 56, 4, 1879);
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
    		source: "(51:3) <Button      width='5rem'      height='2rem'      backgroundColor='#B8FFC8'      onClick={joinChallenge(params.id)}     >",
    		ctx
    	});

    	return block;
    }

    // (75:3) {#each group as member}
    function create_each_block$3(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*member*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t3;
    	let grass;
    	let t4;
    	let current;

    	grass = new Grass({
    			props: { grass_list: /*grass_list*/ ctx[1] },
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
    			add_location(p0, file$8, 77, 6, 2348);
    			add_location(p1, file$8, 78, 6, 2398);
    			attr_dev(div0, "class", "grass_title svelte-mh2seb");
    			add_location(div0, file$8, 76, 5, 2315);
    			attr_dev(div1, "class", "personal_grass svelte-mh2seb");
    			add_location(div1, file$8, 75, 4, 2280);
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
    			if (dirty & /*grass_list*/ 2) grass_changes.grass_list = /*grass_list*/ ctx[1];
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(75:3) {#each group as member}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let show_if = !/*group*/ ctx[4].includes(/*$user*/ ctx[3].githubId);
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
    	let if_block = show_if && create_if_block$3(ctx);

    	grass = new Grass({
    			props: {
    				grass_list: /*grass_team*/ ctx[2],
    				isBig: true,
    				group_num: /*group*/ ctx[4].length
    			},
    			$$inline: true
    		});

    	let each_value = /*group*/ ctx[4];
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
    				group: /*group*/ ctx[4],
    				req_list: /*req_list*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "챌린지 이름";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "하루 한번 씩";
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
    			attr_dev(div0, "class", "upper_title svelte-mh2seb");
    			add_location(div0, file$8, 45, 2, 1591);
    			attr_dev(div1, "class", "upper_description svelte-mh2seb");
    			add_location(div1, file$8, 46, 2, 1632);
    			attr_dev(div2, "class", "title_desc");
    			add_location(div2, file$8, 44, 1, 1563);
    			attr_dev(div3, "class", "upper svelte-mh2seb");
    			add_location(div3, file$8, 41, 0, 1420);
    			attr_dev(p, "class", "grass_title svelte-mh2seb");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "font-size", "1.1rem");
    			add_location(p, file$8, 63, 2, 2004);
    			attr_dev(div4, "class", "team_grass svelte-mh2seb");
    			add_location(div4, file$8, 62, 1, 1976);
    			attr_dev(div5, "class", "personal svelte-mh2seb");
    			add_location(div5, file$8, 73, 2, 2224);
    			attr_dev(div6, "class", "personal_admit svelte-mh2seb");
    			add_location(div6, file$8, 72, 1, 2192);
    			attr_dev(div7, "class", "content svelte-mh2seb");
    			add_location(div7, file$8, 61, 0, 1952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
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
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$user*/ 8) show_if = !/*group*/ ctx[4].includes(/*$user*/ ctx[3].githubId);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$user*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
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
    			if (dirty & /*grass_team*/ 4) grass_changes.grass_list = /*grass_team*/ ctx[2];
    			grass.$set(grass_changes);

    			if (dirty & /*grass_list, group*/ 18) {
    				each_value = /*group*/ ctx[4];
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
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChallengeDetail', slots, []);
    	let { params = {} } = $$props;
    	let challenge = null;

    	beforeUpdate(() => {
    		if (!$user) {
    			if (localStorage.getItem(ACCESS_TOKEN)) getUser(); else push('/login');
    		}
    	});

    	onMount(async () => {
    		challenge = await getChallenge(params.id);
    	});

    	let group = ["user", "grabit123", "||JTO||", "guest"];
    	let grass_list = new Array(365);
    	let grass_team = new Array(365);

    	for (let i = 0; i < 365; i += 1) {
    		grass_list[i] = { date: '', count: i % 9 };
    		grass_team[i] = { date: '', count: i % 5 };
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

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChallengeDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
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
    		Button,
    		params,
    		challenge,
    		group,
    		grass_list,
    		grass_team,
    		req_list,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('challenge' in $$props) challenge = $$props.challenge;
    		if ('group' in $$props) $$invalidate(4, group = $$props.group);
    		if ('grass_list' in $$props) $$invalidate(1, grass_list = $$props.grass_list);
    		if ('grass_team' in $$props) $$invalidate(2, grass_team = $$props.grass_team);
    		if ('req_list' in $$props) $$invalidate(5, req_list = $$props.req_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, grass_list, grass_team, $user, group, req_list];
    }

    class ChallengeDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 0 });

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

    /* src\pages\CreateChallenge.svelte generated by Svelte v3.46.3 */
    const file$7 = "src\\pages\\CreateChallenge.svelte";

    // (67:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='var(--main-green-color)'      onClick={save}     >
    function create_default_slot_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Create";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$7, 72, 4, 2069);
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
    		source: "(67:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='var(--main-green-color)'      onClick={save}     >",
    		ctx
    	});

    	return block;
    }

    // (76:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='#E3E3E3'      onClick={cancel}     >
    function create_default_slot$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cancel";
    			attr_dev(div, "class", "button_text");
    			add_location(div, file$7, 81, 4, 2238);
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
    		source: "(76:3) <Button       width='7rem'      height='2.5rem'      backgroundColor='#E3E3E3'      onClick={cancel}     >",
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
    			t4 = text("Challenge name\r\n\t\t\t\t");
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
    			add_location(div0, file$7, 33, 2, 768);
    			attr_dev(hr0, "align", "left");
    			attr_dev(hr0, "class", "hr svelte-ffg6jw");
    			add_location(hr0, file$7, 34, 2, 815);
    			set_style(span, "color", "red");
    			add_location(span, file$7, 37, 4, 909);
    			attr_dev(div1, "class", "text svelte-ffg6jw");
    			add_location(div1, file$7, 36, 3, 873);
    			attr_dev(div2, "class", "text svelte-ffg6jw");
    			add_location(div2, file$7, 41, 3, 1028);
    			attr_dev(div3, "class", "sub_content svelte-ffg6jw");
    			add_location(div3, file$7, 35, 2, 845);
    			attr_dev(hr1, "align", "left");
    			attr_dev(hr1, "class", "hr svelte-ffg6jw");
    			add_location(hr1, file$7, 45, 2, 1127);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "secure");
    			input2.checked = "check";
    			input2.__value = false;
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[8][0].push(input2);
    			add_location(input2, file$7, 48, 4, 1210);
    			attr_dev(img0, "class", "image svelte-ffg6jw");
    			if (!src_url_equal(img0.src, img0_src_value = "images/public.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "public_img");
    			add_location(img0, file$7, 49, 4, 1302);
    			attr_dev(div4, "class", "small_text svelte-ffg6jw");
    			add_location(div4, file$7, 51, 5, 1382);
    			attr_dev(div5, "class", "explain_text svelte-ffg6jw");
    			add_location(div5, file$7, 52, 5, 1423);
    			add_location(div6, file$7, 50, 4, 1370);
    			attr_dev(div7, "class", "contain svelte-ffg6jw");
    			add_location(div7, file$7, 47, 3, 1185);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "secure");
    			attr_dev(input3, "align", "middle");
    			input3.__value = true;
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[8][0].push(input3);
    			add_location(input3, file$7, 56, 4, 1552);
    			attr_dev(img1, "class", "image svelte-ffg6jw");
    			if (!src_url_equal(img1.src, img1_src_value = "images/private.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "private_img");
    			add_location(img1, file$7, 57, 4, 1643);
    			attr_dev(div8, "class", "small_text svelte-ffg6jw");
    			add_location(div8, file$7, 59, 5, 1725);
    			attr_dev(div9, "class", "explain_text svelte-ffg6jw");
    			add_location(div9, file$7, 60, 5, 1767);
    			add_location(div10, file$7, 58, 4, 1713);
    			attr_dev(div11, "class", "contain svelte-ffg6jw");
    			add_location(div11, file$7, 55, 3, 1527);
    			attr_dev(div12, "class", "sub_content svelte-ffg6jw");
    			add_location(div12, file$7, 46, 2, 1157);
    			attr_dev(hr2, "align", "left");
    			attr_dev(hr2, "class", "hr svelte-ffg6jw");
    			add_location(hr2, file$7, 64, 2, 1884);
    			attr_dev(div13, "class", "sub_content svelte-ffg6jw");
    			add_location(div13, file$7, 65, 2, 1914);
    			attr_dev(div14, "class", "content svelte-ffg6jw");
    			add_location(div14, file$7, 32, 1, 743);
    			attr_dev(div15, "class", "page svelte-ffg6jw");
    			add_location(div15, file$7, 31, 0, 722);
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

    /* src\components\ChallengeBox.svelte generated by Svelte v3.46.3 */
    const file$6 = "src\\components\\ChallengeBox.svelte";

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
    			add_location(img, file$6, 27, 6, 670);
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
    			add_location(img, file$6, 32, 6, 938);
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
    			add_location(img, file$6, 30, 6, 818);
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
    			add_location(span, file$6, 24, 3, 524);
    			attr_dev(div0, "class", "Box__header__group svelte-aquluz");
    			add_location(div0, file$6, 25, 3, 609);
    			attr_dev(div1, "class", "Box__header svelte-aquluz");
    			add_location(div1, file$6, 23, 2, 494);
    			attr_dev(div2, "class", "Box__content");
    			add_location(div2, file$6, 36, 2, 1068);
    			add_location(div3, file$6, 22, 1, 485);
    			attr_dev(img0, "class", "Box__icon svelte-aquluz");
    			if (!src_url_equal(img0.src, img0_src_value = "images/human.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "human");
    			add_location(img0, file$6, 42, 3, 1216);
    			attr_dev(div4, "class", "Box__footer__group svelte-aquluz");
    			add_location(div4, file$6, 41, 2, 1179);
    			attr_dev(img1, "class", "Box__icon svelte-aquluz");
    			if (!src_url_equal(img1.src, img1_src_value = "images/crown.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "crown");
    			add_location(img1, file$6, 46, 3, 1361);
    			attr_dev(div5, "class", "Box__footer__group svelte-aquluz");
    			add_location(div5, file$6, 45, 2, 1324);
    			attr_dev(div6, "class", "Box__footer svelte-aquluz");
    			add_location(div6, file$6, 40, 1, 1150);
    			attr_dev(div7, "class", "Box svelte-aquluz");
    			add_location(div7, file$6, 21, 0, 465);
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

    /* src\pages\MyChallengeList.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\pages\\MyChallengeList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (42:3) <Button {onClick} width="4rem" height="1.9rem" backgroundColor="#50CE92" style="border: none; color: white;">
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
    		source: "(42:3) <Button {onClick} width=\\\"4rem\\\" height=\\\"1.9rem\\\" backgroundColor=\\\"#50CE92\\\" style=\\\"border: none; color: white;\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:3) {#each $challengeList as c}
    function create_each_block$2(ctx) {
    	let challengebox;
    	let current;

    	challengebox = new ChallengeBox({
    			props: { challenge: /*c*/ ctx[2] },
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
    			if (dirty & /*$challengeList*/ 1) challengebox_changes.challenge = /*c*/ ctx[2];
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
    		source: "(45:3) {#each $challengeList as c}",
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
    	searchinput = new SearchInput({ props: { searchHandler: searchHandler$1 }, $$inline: true });

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

    	let each_value = /*$challengeList*/ ctx[0];
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
    			add_location(div0, file$5, 39, 2, 1052);
    			attr_dev(div1, "class", "MyChallengeList__list svelte-cu6oox");
    			add_location(div1, file$5, 43, 2, 1268);
    			attr_dev(div2, "class", "MyChallengeList__content svelte-cu6oox");
    			add_location(div2, file$5, 38, 1, 1010);
    			attr_dev(div3, "class", "MyChallengeList svelte-cu6oox");
    			add_location(div3, file$5, 36, 0, 964);
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

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*$challengeList*/ 1) {
    				each_value = /*$challengeList*/ ctx[0];
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

    function searchHandler$1(val) {
    	alert(val + "를 검색하셨습니다.");
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $challengeList;
    	validate_store(challengeList, 'challengeList');
    	component_subscribe($$self, challengeList, $$value => $$invalidate(0, $challengeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyChallengeList', slots, []);

    	function onClick() {
    		push$1('/createchallenge');
    	}

    	onMount(async () => {
    		changeTab(index.MYCHALLENGE);

    		if (!challengeList) {
    			const myChallengeData = await getUserChallenge();
    			challengeList.set(myChallengeData);
    		}
    	});

    	onDestroy(() => {
    		changeTab(index.HOME);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyChallengeList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		push: push$1,
    		changeTab,
    		challengeList,
    		index,
    		GlobalNavigationBar,
    		Profile,
    		ChallengeBox,
    		Button,
    		SearchInput,
    		getUserChallenge,
    		onClick,
    		searchHandler: searchHandler$1,
    		$challengeList
    	});

    	return [$challengeList, onClick];
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

    /* src\components\PagingDiv.svelte generated by Svelte v3.46.3 */
    const file$4 = "src\\components\\PagingDiv.svelte";

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
    			add_location(button, file$4, 53, 12, 1391);
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
    			add_location(input, file$4, 63, 20, 1883);
    			attr_dev(span, "class", "svelte-1biztz4");
    			add_location(span, file$4, 64, 20, 1995);
    			attr_dev(label, "class", "Paging__button svelte-1biztz4");
    			add_location(label, file$4, 62, 16, 1831);
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
    			add_location(input, file$4, 58, 20, 1620);
    			attr_dev(span, "class", "svelte-1biztz4");
    			add_location(span, file$4, 59, 20, 1750);
    			attr_dev(label, "class", "Paging__button svelte-1biztz4");
    			add_location(label, file$4, 57, 16, 1568);
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
    			add_location(button, file$4, 69, 12, 2132);
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
    			add_location(div, file$4, 50, 0, 1299);
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

    /* src\pages\TotalChallengeList.svelte generated by Svelte v3.46.3 */
    const file$3 = "src\\pages\\TotalChallengeList.svelte";

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
    			add_location(div, file$3, 77, 16, 2290);
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
    			add_location(div0, file$3, 66, 12, 1810);
    			attr_dev(div1, "class", "Page__top__create_btn svelte-1c0ugx3");
    			add_location(div1, file$3, 71, 12, 1961);
    			attr_dev(div2, "class", "Page__top svelte-1c0ugx3");
    			add_location(div2, file$3, 65, 8, 1773);
    			attr_dev(div3, "class", "Page__sort svelte-1c0ugx3");
    			add_location(div3, file$3, 75, 8, 2204);
    			attr_dev(div4, "class", "Page__content svelte-1c0ugx3");
    			add_location(div4, file$3, 64, 4, 1736);
    			attr_dev(div5, "class", "Page svelte-1c0ugx3");
    			add_location(div5, file$3, 61, 0, 1689);
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

    /* src\pages\EditProfile.svelte generated by Svelte v3.46.3 */
    const file_1 = "src\\pages\\EditProfile.svelte";

    // (140:0) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*refuseEnter*/ ctx[9]() + "";
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
    		source: "(140:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (97:0) {#if $user}
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
    		/*input1_bindvalue_binding*/ ctx[13](value);
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
    				onClick: /*Save*/ ctx[7],
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
    				onClick: /*Cancel*/ ctx[8],
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
    			attr_dev(div0, "class", "btn__text svelte-1gvl8v6");
    			add_location(div0, file_1, 106, 20, 3092);
    			attr_dev(label, "class", "btn__input_image svelte-1gvl8v6");
    			attr_dev(label, "for", "input-file");
    			add_location(label, file_1, 105, 16, 3021);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", ".jpg,.png,.jpeg");
    			attr_dev(input0, "id", "input-file");
    			set_style(input0, "display", "none");
    			add_location(input0, file_1, 108, 16, 3167);
    			attr_dev(div1, "class", "div__column svelte-1gvl8v6");
    			add_location(div1, file_1, 99, 12, 2699);
    			attr_dev(div2, "class", "text svelte-1gvl8v6");
    			add_location(div2, file_1, 112, 16, 3368);
    			attr_dev(div3, "class", "text svelte-1gvl8v6");
    			add_location(div3, file_1, 115, 16, 3502);
    			attr_dev(textarea, "placeholder", "Add a bio");
    			attr_dev(textarea, "class", "svelte-1gvl8v6");
    			add_location(textarea, file_1, 116, 16, 3545);
    			attr_dev(div4, "class", "btn__div svelte-1gvl8v6");
    			add_location(div4, file_1, 118, 16, 3627);
    			attr_dev(div5, "class", "div__column svelte-1gvl8v6");
    			add_location(div5, file_1, 111, 12, 3325);
    			attr_dev(div6, "class", "div__row svelte-1gvl8v6");
    			add_location(div6, file_1, 98, 8, 2663);
    			attr_dev(div7, "class", "div svelte-1gvl8v6");
    			add_location(div7, file_1, 97, 4, 2636);
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
    			/*input0_binding*/ ctx[12](input0);
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
    					listen_dev(input0, "change", /*onChange*/ ctx[10], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[14])
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

    			if (dirty & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    			/*input0_binding*/ ctx[12](null);
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
    		source: "(97:0) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (103:16) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Preview");
    			attr_dev(img, "class", "content__profileImg svelte-1gvl8v6");
    			add_location(img, file_1, 103, 20, 2906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			/*img_binding*/ ctx[11](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			/*img_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(103:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:16) {#if !showImage}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*checkProfileImage*/ ctx[6]())) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "userProfile");
    			attr_dev(img, "class", "content__profileImg svelte-1gvl8v6");
    			add_location(img, file_1, 101, 20, 2780);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(101:16) {#if !showImage}",
    		ctx
    	});

    	return block;
    }

    // (120:20) <Button                           width='7rem'                          height='2.5rem'                          backgroundColor='var(--main-green-color)'                          onClick={Save}                      >
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Save";
    			attr_dev(div, "class", "btn__text svelte-1gvl8v6");
    			add_location(div, file_1, 125, 24, 3915);
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
    		source: "(120:20) <Button                           width='7rem'                          height='2.5rem'                          backgroundColor='var(--main-green-color)'                          onClick={Save}                      >",
    		ctx
    	});

    	return block;
    }

    // (128:20) <Button                           width='7rem'                          height='2.5rem'                          backgroundColor='#E3E3E3'                          onClick={Cancel}                      >
    function create_default_slot$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cancel";
    			attr_dev(div, "class", "btn__text svelte-1gvl8v6");
    			add_location(div, file_1, 133, 24, 4229);
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
    		source: "(128:20) <Button                           width='7rem'                          height='2.5rem'                          backgroundColor='#E3E3E3'                          onClick={Cancel}                      >",
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

    	const checkProfileImage = () => {
    		if ($user.profileImg) return $user.profileImg;
    		return GIT_URL + '/' + $user.githubId + '.png';
    	};

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
    		checkProfileImage,
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
    		checkProfileImage,
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

    /* src\pages\RedirectPage.svelte generated by Svelte v3.46.3 */
    const file$2 = "src\\pages\\RedirectPage.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			add_location(div, file$2, 6, 0, 91);
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
    			attr_dev(span0, "class", "NotFound__head svelte-1xudf5y");
    			add_location(span0, file$1, 10, 1, 176);
    			add_location(br, file$1, 12, 17, 265);
    			attr_dev(span1, "class", "NotFound__sub svelte-1xudf5y");
    			add_location(span1, file$1, 11, 1, 218);
    			attr_dev(div, "class", "NotFound svelte-1xudf5y");
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
