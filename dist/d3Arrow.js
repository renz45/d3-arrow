(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.d3Arrow = global.d3Arrow || {})));
}(this, function (exports) { 'use strict';

    var pi = Math.PI;
    var tau = 2 * pi;
    var epsilon = 1e-6;
    var tauEpsilon = tau - epsilon;
    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = [];
    }

    function path() {
      return new Path();
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function (x, y) {
        this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y);
      },
      closePath: function () {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._.push("Z");
        }
      },
      lineTo: function (x, y) {
        this._.push("L", this._x1 = +x, ",", this._y1 = +y);
      },
      quadraticCurveTo: function (x1, y1, x, y) {
        this._.push("Q", +x1, ",", +y1, ",", this._x1 = +x, ",", this._y1 = +y);
      },
      bezierCurveTo: function (x1, y1, x2, y2, x, y) {
        this._.push("C", +x1, ",", +y1, ",", +x2, ",", +y2, ",", this._x1 = +x, ",", this._y1 = +y);
      },
      arcTo: function (x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._.push("M", this._x1 = x1, ",", this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon)) ;

          // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
          // Equivalently, is (x1,y1) coincident with (x2,y2)?
          // Or, is the radius zero? Line to (x1,y1).
          else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
              this._.push("L", this._x1 = x1, ",", this._y1 = y1);
            }

            // Otherwise, draw an arc!
            else {
                var x20 = x2 - x0,
                    y20 = y2 - y0,
                    l21_2 = x21 * x21 + y21 * y21,
                    l20_2 = x20 * x20 + y20 * y20,
                    l21 = Math.sqrt(l21_2),
                    l01 = Math.sqrt(l01_2),
                    l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                    t01 = l / l01,
                    t21 = l / l21;

                // If the start tangent is not coincident with (x0,y0), line to.
                if (Math.abs(t01 - 1) > epsilon) {
                  this._.push("L", x1 + t01 * x01, ",", y1 + t01 * y01);
                }

                this._.push("A", r, ",", r, ",0,0,", +(y01 * x20 > x01 * y20), ",", this._x1 = x1 + t21 * x21, ",", this._y1 = y1 + t21 * y21);
              }
      },
      arc: function (x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._.push("M", x0, ",", y0);
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
            this._.push("L", x0, ",", y0);
          }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._.push("A", r, ",", r, ",0,1,", cw, ",", x - dx, ",", y - dy, "A", r, ",", r, ",0,1,", cw, ",", this._x1 = x0, ",", this._y1 = y0);
        }

        // Otherwise, draw an arc!
        else {
            if (da < 0) da = da % tau + tau;
            this._.push("A", r, ",", r, ",0,", +(da >= pi), ",", cw, ",", this._x1 = x + r * Math.cos(a1), ",", this._y1 = y + r * Math.sin(a1));
          }
      },
      rect: function (x, y, w, h) {
        this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y, "h", +w, "v", +h, "h", -w, "Z");
      },
      toString: function () {
        return this._.join("");
      }
    };

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace (name) {
      var prefix = name += "",
          i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
    }

    function creatorInherit(name) {
      return function () {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function () {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator (name) {
      var fullname = namespace(name);
      return (fullname.local ? creatorFixed : creatorInherit)(fullname);
    }

    var matcher = function (selector) {
      return function () {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element = document.documentElement;
      if (!element.matches) {
        var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
        matcher = function (selector) {
          return function () {
            return vendorMatches.call(this, selector);
          };
        };
      }
    }

    var matcher$1 = matcher;

    var filterEvents = {};

    var event = null;

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!("onmouseenter" in element$1)) {
        filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function (event) {
        var related = event.relatedTarget;
        if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function (event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
          event = event0;
        }
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function (t) {
        var name = "",
            i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return { type: t, name: name };
      });
    }

    function onRemove(typename) {
      return function () {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function (d, i, group) {
        var on = this.__on,
            o,
            listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
        if (!on) this.__on = [o];else on.push(o);
      };
    }

    function selection_on (typename, value, capture) {
      var typenames = parseTypenames(typename + ""),
          i,
          n = typenames.length,
          t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function defaultView (node) {
        return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
        node.document && node // node is a Window
         || node.defaultView; // node is a Document
    }

    function selector (selector) {
      return function () {
        return this.querySelector(selector);
      };
    }

    function selection_select (select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function selectorAll (selector) {
      return function () {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll (select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function selection_filter (match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup[i] = node;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function constant (x) {
      return function () {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, only the first one counts.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (!nodeByKeyValue[keyValue]) {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If multiple data have the same key, only the first one counts.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);

        // Is there a node associated with this key?
        // If not, this datum is added to the enter selection.
        if (!(node = nodeByKeyValue[keyValue])) {
          enter[i] = new EnterNode(parent, data[i]);
        }

        // Did we already bind a node using this key? (Or is a duplicate?)
        // If unique, the node and datum are joined in the update selection.
        // Otherwise, the datum is ignored, neither entering nor exiting.
        else if (node !== true) {
            update[i] = node;
            node.__data__ = data[i];
          }

        // Record that we consumed this key, either to enter or update.
        nodeByKeyValue[keyValue] = true;
      }

      // Take any remaining nodes that were not bound to data,
      // and place them in the exit selection.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && nodeByKeyValue[keyValues[i]] !== true) {
          exit[i] = node;
        }
      }
    }

    function selection_data (value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function (d) {
          data[++j] = d;
        });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function (child) {
        return this._parent.insertBefore(child, this._next);
      },
      insertBefore: function (child, next) {
        return this._parent.insertBefore(child, next);
      },
      querySelector: function (selector) {
        return this._parent.querySelector(selector);
      },
      querySelectorAll: function (selector) {
        return this._parent.querySelectorAll(selector);
      }
    };

    function sparse (update) {
      return new Array(update.length);
    }

    function selection_enter () {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function selection_exit () {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge (selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order () {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort (compare) {
      if (!compare) compare = ascending;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call () {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes () {
      var nodes = new Array(this.size()),
          i = -1;
      this.each(function () {
        nodes[++i] = this;
      });
      return nodes;
    }

    function selection_node () {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size () {
      var size = 0;
      this.each(function () {
        ++size;
      });
      return size;
    }

    function selection_empty () {
      return !this.node();
    }

    function selection_each (callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function () {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function () {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function () {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function () {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr (name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
      }

      return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
    }

    function styleRemove(name) {
      return function () {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function () {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style (name, value, priority) {
      var node;
      return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : defaultView(node = this.node()).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function () {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function () {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];else this[name] = v;
      };
    }

    function selection_property (name, value) {
      return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function (name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function (name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function (name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node),
          i = -1,
          n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node),
          i = -1,
          n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function () {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function () {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function () {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed (name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()),
            i = -1,
            n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function () {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function () {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text (value) {
      return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function () {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function () {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html (value) {
      return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
    }

    function raise() {
      this.parentNode.appendChild(this);
    }

    function selection_raise () {
      return this.each(raise);
    }

    function lower() {
      this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower () {
      return this.each(lower);
    }

    function append(create) {
      return function () {
        return this.appendChild(create.apply(this, arguments));
      };
    }

    function insert(create, select) {
      return function () {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      };
    }

    function constantNull() {
      return null;
    }

    function selection_append (name, before) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(arguments.length < 2 ? append(create) : insert(create, before == null ? constantNull : typeof before === "function" ? before : selector(before)));
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove () {
      return this.each(remove);
    }

    function selection_datum (value) {
        return arguments.length ? this.property("__data__", value) : this.node().__data__;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (event) {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function () {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function () {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch (type, params) {
      return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      remove: selection_remove,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select (selector) {
        return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
    }

    var bug44083 = typeof navigator !== "undefined" && /WebKit/.test(navigator.userAgent) ? -1 : 0;

    class Utils {
      static elementCoords(element, options) {
        let el = element.node && element.node() || element;
        let boundingBox = el.getBoundingClientRect();
        let elementLoc = { x: boundingBox.left, y: boundingBox.top };
        let positionPercent = (options.position || 0) / 100;
        let depth = options.depth || 0;

        switch (options.orientation) {
          case "top":
            elementLoc.x = boundingBox.left - (boundingBox.left - boundingBox.right) / 2 - boundingBox.width / 2 * positionPercent;
            elementLoc.y = boundingBox.top + depth;
            break;
          case "bottom":
            elementLoc.x = boundingBox.left - (boundingBox.left - boundingBox.right) / 2 - boundingBox.width / 2 * positionPercent;
            elementLoc.y = boundingBox.bottom - depth;
            break;
          case "right":
            elementLoc.x = boundingBox.right - depth;
            elementLoc.y = boundingBox.top - (boundingBox.top - boundingBox.bottom) / 2 - boundingBox.height / 2 * positionPercent;
            break;
          case "left":
          default:
            elementLoc.x = boundingBox.left + depth;
            elementLoc.y = boundingBox.top - (boundingBox.top - boundingBox.bottom) / 2 - boundingBox.height / 2 * positionPercent;
            break;
        }
        return elementLoc;
      }

      // #goodenough
      static uid() {
        return ("00000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6);
      }

      static uniqueClass(klass, uid) {
        return `${ klass }:${ uid }`;
      }

      // startLoc and endLoc are objects that contain x, y, orientation
      // orientation is one of the following: top, bottom, left, right
      // orientation is used to customize the curve based on the face its pointing
      static autoCurveTo(path, startLoc, endLoc, options) {
        // How close x or y values of each start/end point need to be before a default
        // curve is generated. So if the start and end points are directly vertical or horizonal
        // to each other, this creates a slight curve
        let verticalCurvePadding = 50;
        let samePlaneTolerance = 15;
        let cStartLoc = { x: startLoc.x, y: endLoc.y };
        let cEndLoc = { x: endLoc.x, y: startLoc.y };

        switch (startLoc.orientation) {
          case "top":
            if (Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance) {
              cStartLoc = { x: startLoc.x, y: endLoc.y - verticalCurvePadding };
            } else {
              cStartLoc = { x: startLoc.x, y: endLoc.y };
            }
            break;
          case "bottom":
            if (Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance) {
              cStartLoc = { x: startLoc.x, y: endLoc.y + verticalCurvePadding };
            } else {
              cStartLoc = { x: startLoc.x, y: endLoc.y };
            }
            break;
          case "right":
            if (Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance) {
              cStartLoc = { x: endLoc.x + verticalCurvePadding, y: startLoc.y };
            } else {
              cStartLoc = { x: endLoc.x, y: startLoc.y };
            }
            break;
          case "left":
          default:
            if (Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance) {
              cStartLoc = { x: endLoc.x - verticalCurvePadding, y: startLoc.y };
            } else {
              cStartLoc = { x: endLoc.x, y: startLoc.y };
            }
            break;
        }

        switch (endLoc.orientation) {
          case "top":
            if (Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance) {
              cEndLoc = { x: endLoc.x, y: startLoc.y - verticalCurvePadding };
            } else {
              cEndLoc = { x: endLoc.x, y: startLoc.y };
            }
            break;
          case "bottom":
            if (Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance) {
              cEndLoc = { x: endLoc.x, y: startLoc.y + verticalCurvePadding };
            } else {
              cEndLoc = { x: endLoc.x, y: startLoc.y };
            }
            break;
          case "right":
            if (Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance) {
              cEndLoc = { x: startLoc.x + verticalCurvePadding, y: endLoc.y };
            } else {
              cEndLoc = { x: startLoc.x, y: endLoc.y };
            }
            break;
          case "left":
          default:
            if (Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance) {
              cEndLoc = { x: startLoc.x - verticalCurvePadding, y: endLoc.y };
            } else {
              cEndLoc = { x: startLoc.x, y: endLoc.y };
            }
            break;
        }

        path.bezierCurveTo(cStartLoc.x, cStartLoc.y, cEndLoc.x, cEndLoc.y, endLoc.x, endLoc.y);
      }
    }

    class Arrow {
      constructor(options = { color: "#444" }) {
        this.startLoc = {};
        this.endLoc = {};
        this.uid = Utils.uid();
        this.svgPadding = 20;
        this.svg = this.createSvg(options);
        this.arrowHead = this.createArrowHead(this.svg, options);
        this.path = this.createPath(this.svg, options);

        this.arrowDashOffset = 30;

        if (options.startingArrow) {
          this.startingArrow = this.createArrowHead(this.svg, options);
          this.startingArrow.attr("id", Utils.uniqueClass("start-arrow-head", this.uid));
        }
      }

      animateDraw(percentVal) {
        this.currentAnimateDraw = percentVal;
        let percent = percentVal;
        let pathLength = this.pathLength();
        let dashLength = pathLength * (percent / 100);

        this.path.attr("stroke-dashoffset", 10);

        if (this.startingArrow) {
          if (dashLength > pathLength - this.arrowDashOffset) {
            dashLength = pathLength - this.arrowDashOffset;
            percent = 100;
          }

          this.path.attr('stroke-dasharray', `0 ${ this.arrowDashOffset } ${ dashLength } ${ pathLength + 10 }`);
        } else {
          this.path.attr('stroke-dasharray', `0 0 ${ dashLength } ${ pathLength + 10 }`);
        }

        if (percent == 100) {
          this.path.attr("marker-end", `url(#${ Utils.uniqueClass("arrow-head", this.uid) })`);
        } else if (percent == 0) {
          if (this.startingArrow) {
            this.path.attr("marker-start", "");
            this.path.attr("stroke-dashoffset", this.arrowDashOffset + 5);
          }
        } else {
          this.path.attr("marker-end", "");
        }

        if (percent > 0 && this.startingArrow) {
          this.path.attr("marker-start", `url(#${ Utils.uniqueClass("start-arrow-head", this.uid) })`);
        }
      }

      pathLength() {
        return this.path.node().getTotalLength();
      }

      createSvg(options) {
        return select(options.parent || "html").append('svg:svg').attr("width", 1000).attr("id", "d3-arrow").attr("height", 1000).attr("fill", "none").style("position", "absolute").style("top", 0).style("left", 0).style("pointer-events", "none");
      }

      createArrowHead(svg, options) {
        let marker = svg.append("defs").append("marker");
        marker.attr("id", Utils.uniqueClass("arrow-head", this.uid)).attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 30).attr("markerHeight", 80).attr("markerUnits", "userSpaceOnUse").attr("stroke", "none").attr("orient", "auto").attr("fill", options.color).append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");
        return marker;
      }

      createPath(svg, options) {
        return svg.append("path").attr("stroke", options.color).attr("stroke-width", 10).attr("stroke-linecap", "round").attr("fill", "none");
      }

      drawFrom(selector, options = { orientation: "left" }) {
        this.drawFromOptions = options;
        this.startEl = select(selector);
        this.startLoc = Utils.elementCoords(this.startEl, options);
        this.startLoc.orientation = options.orientation;
        return this;
      }

      drawTo(selector, options = { orientation: "left" }) {
        this.drawToOptions = options;
        this.endEl = select(selector);
        this.endLoc = Utils.elementCoords(this.endEl, this.drawToOptions);
        this.endLoc.orientation = options.orientation;

        this.draw(this.startLoc, this.endLoc, this.drawToOptions);
      }

      redraw() {
        let currentAnimateDraw = this.currentAnimateDraw || 100;
        let startOrientation = this.startLoc.orientation;
        let endOrientation = this.endLoc.orientation;

        this.startLoc = Utils.elementCoords(this.startEl, this.drawFromOptions);
        this.endLoc = Utils.elementCoords(this.endEl, this.drawToOptions);
        this.startLoc.orientation = startOrientation;
        this.endLoc.orientation = endOrientation;

        this.draw(this.startLoc, this.endLoc, this.drawToOptions);
        this.animateDraw(currentAnimateDraw);
      }

      resizeSvgToFitPath(path) {
        let pathNode = path.node();
        let pathBounds = pathNode.getBoundingClientRect();
        let svgNode = this.svg.node();
        let svgBounds = svgNode.getBoundingClientRect();

        this.svg.attr("width", pathBounds.width + this.svgPadding * 2);
        this.svg.attr("height", pathBounds.height + this.svgPadding * 2);
        this.svg.style("left", pathBounds.left - this.svgPadding);
        this.svg.style("top", pathBounds.top - this.svgPadding);

        this.path.attr("transform", `translate(${ -pathBounds.left + this.svgPadding },${ -pathBounds.top + this.svgPadding })`);
      }

      calcSlope(p1, p2) {
        let slope = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) * 180 / Math.PI;

        // account for negative angles
        if (slope <= 0 && p2.x - p1.x < 0 || slope > 0 && p2.x - p1.x < 0) {
          slope += 180;
        }
        return slope;
      }

      draw(startLoc, endLoc, options) {
        this.arrowPath = path();
        if (options.visible === undefined) {
          options.visible = true;
        }

        // Move to the beginning of the arrow
        this.arrowPath.moveTo(startLoc.x, startLoc.y);

        // intelligent curve
        Utils.autoCurveTo(this.arrowPath, startLoc, endLoc);

        // Render the arrow as an svg path and attach the triangle marker as the arrow head
        this.path.attr("d", this.arrowPath.toString());

        // Resize the svg to be a bounding box rather then 0 based full screen
        this.resizeSvgToFitPath(this.path);

        if (!options.visible) {
          this.animateDraw(0);
        } else {
          let pathLength = this.pathLength();
          let pathNode = this.path.node();
          let p1 = pathNode.getPointAtLength(pathLength - 20);
          let p2 = pathNode.getPointAtLength(pathLength);

          this.arrowHead.attr("orient", this.calcSlope(p1, p2));

          if (this.startingArrow) {
            let p3 = pathNode.getPointAtLength(20);
            let p4 = pathNode.getPointAtLength(1);

            this.startingArrow.attr("orient", this.calcSlope(p3, p4));
          }

          this.animateDraw(100);
        }
      }
    }

    exports.Arrow = Arrow;

}));