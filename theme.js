/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
/* Ensure Tiro Bangla only: filter out Google Fonts Noto Serif Bengali nodes (no function overrides). */
(function(){
  var reNoto = /fonts\.googleapis\.com\/(?:css2|css)\?[^"'\s>]*family=Noto\+Serif\+Bengali/i;

  function getHref(n){
    try { return (n && n.getAttribute && (n.getAttribute('href')||'')) || n.href || ''; }
    catch(e){ return ''; }
  }

  function isNotoLink(n){
    try{
      return n && n.nodeType===1 && n.tagName &&
        n.tagName.toLowerCase()==='link' &&
        reNoto.test(getHref(n));
    }catch(e){ return false; }
  }

  function isNotoStyle(n){
    try{
      return n && n.nodeType===1 && n.tagName &&
        n.tagName.toLowerCase()==='style' &&
        /Noto\+Serif\+Bengali/i.test(n.textContent||'');
    }catch(e){ return false; }
  }

  function removeIfMatch(n){
    try{
      if(isNotoLink(n) || isNotoStyle(n)){
        if(n.parentNode) n.parentNode.removeChild(n);
        return true;
      }
    }catch(e){console.error(e);}
    return false;
  }

  // Remove any existing nodes
  try{
    var head = document.head || document.getElementsByTagName('head')[0];
    if(head){
      var existing = head.querySelectorAll('link,style');
      for(var i=existing.length-1;i>=0;i--){
        removeIfMatch(existing[i]);
      }
    }
  }catch(e){console.error(e);}

  // Observe future injections
  try{
    if(!window.MutationObserver) return;
    var root = document.head || document.documentElement;
    var obs = new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var added = muts[i].addedNodes;
        if(!added) continue;
        for(var j=0;j<added.length;j++){
          var n = added[j];
          if(!n) continue;
          if(removeIfMatch(n)) continue;
          // Handle nested insertions (fragments)
          try{
            if(n.querySelectorAll){
              var sub = n.querySelectorAll('link,style');
              for(var k=sub.length-1;k>=0;k--){
                removeIfMatch(sub[k]);
              }
            }
          }catch(e){console.error(e);}
        }
      }
    });
    obs.observe(root, { childList:true, subtree:true });
  }catch(e){console.error(e);}
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
/* Fix: prevent deprecated 'unload' event listeners.
   - Maps unload listeners to 'pagehide' to remain compatible with modern browsers and bfcache.
   - This is a safe workaround when third-party widgets/ads still try to register 'unload'. */
(function(){
  try {
    if (window.__noUnloadListenerPatched) return;
    window.__noUnloadListenerPatched = true;

    if (!window.EventTarget || !EventTarget.prototype) return;
    var nativeAdd = EventTarget.prototype.addEventListener;
    var nativeRemove = EventTarget.prototype.removeEventListener;
    if (typeof nativeAdd !== 'function' || typeof nativeRemove !== 'function') return;

    var handlerMap = new WeakMap();
    function mapType(t){ return (t === 'unload') ? 'pagehide' : t; }
    function wrap(t, h){
      if (t !== 'unload' || typeof h !== 'function') return h;
      var w = handlerMap.get(h);
      if (w) return w;
      w = function(ev){ return h.call(this, ev); };
      handlerMap.set(h, w);
      return w;
    }

    EventTarget.prototype.addEventListener = function(type, handler, options){
      var t = mapType(type);
      return nativeAdd.call(this, t, wrap(type, handler), options);
    };
    EventTarget.prototype.removeEventListener = function(type, handler, options){
      var t = mapType(type);
      return nativeRemove.call(this, t, wrap(type, handler), options);
    };

    // Best-effort: block direct assignment like window.onunload = fn
    try {
      var desc = Object.getOwnPropertyDescriptor(window, 'onunload');
      if (!desc || desc.configurable) {
        Object.defineProperty(window, 'onunload', {
          configurable: true,
          enumerable: true,
          get: function(){ return null; },
          set: function(fn){
            // Map to pagehide instead
            if (typeof fn === 'function') {
              window.addEventListener('pagehide', fn);
            }
          }
        });
      }
    } catch(e){console.error(e);}
  } catch(e){console.error(e);}
})();


/* ---- extracted from theme XML: <script defer='defer' type='text/javascript'> ---- */
var monthsName = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
noThumb = "",
relatedPostsNum = 3,
commentsSystem = "blogger",
showMoreText = "",
relatedPostsText = "",
loadMorePosts = "",
postPerPage= 6,
pageOfText = ["Page", "of"],
fixedSidebar = true,
fixedMenu = false,
disqusShortname = "";

/* Bangla digit helper for dates */
function __bnDigits(str){
  return String(str).replace(/\d/g, function(d){ return "০১২৩৪৫৬৭৮৯"[d]; });
}

// Normalize date text like "জানুয়ারি 31, 2026" -> "জানুয়ারি ৩১,২০২৬"
function __bnNormalizeDateText(t){
  t = String(t || "");
  t = __bnDigits(t);
  t = t.replace(/\s*,\s*/g, ",");
  // remove leading zero in day part (e.g., ০১ -> ১) right after a month name
  t = t.replace(/(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)\s+০([০-৯])/g, "$1 $2");
  return t.trim();
}


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
/* Passive Event Listeners Fix (safer + more complete) */
(function () {
  var supportsPassive = false;

  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function () { supportsPassive = true; }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch(e){console.error(e);}

  if (!supportsPassive || !window.EventTarget) return;

  var nativeAdd = EventTarget.prototype.addEventListener;
  var passiveTypes = { touchstart: true, touchmove: true, wheel: true };

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (passiveTypes[type]) {
      // If options is boolean (capture) => convert to object
      if (typeof options === "boolean") {
        options = { capture: options, passive: true };
      } else if (options == null) {
        options = { passive: true };
      } else if (typeof options === "object") {
        // Keep existing options, just add passive when not explicitly set
        if (options.passive === undefined) options.passive = true;
      }
    }
    return nativeAdd.call(this, type, listener, options);
  };
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){var el=document.querySelector('.copyright-year'); if(el){el.textContent=(new Date()).getFullYear();}})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){var el=document.querySelector('.copyright-year'); if(el){el.textContent=(new Date()).getFullYear();}})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function() {
  var style = document.createElement('style');
  style.innerHTML = `
    .mobile-date, #Date, .r-date, .header-date, .TopDate, .date-text, #Clock {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .clock-visible {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  
    var __bnClockTimer = null;
  var __bnClockEls = null;
  var __bnClockSelectors = ['.mobile-date', '#Date', '.r-date', '.header-date', '.TopDate', '#Clock'];
  var __bnClockEnRe = /[A-Za-z]/;
  var __bnClockDaysBn = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
  var __bnClockMonthsBn = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  var __bnClockOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' };

  function toBanglaNum(str) {
    return String(str).replace(/\d/g, function(d) { return "০১২৩৪৫৬৭৮৯"[d]; });
  }

  function __bnCollectClockEls() {
    var out = [];
    for (var i = 0; i < __bnClockSelectors.length; i++) {
      var list = document.querySelectorAll(__bnClockSelectors[i]);
      for (var j = 0; j < list.length; j++) out.push(list[j]);
    }
    return out;
  }

  function updateBanglaClock() {
    var now = new Date();

    // Cache target elements to avoid full DOM queries every second.
    if (!__bnClockEls || __bnClockEls.length === 0) {
      __bnClockEls = __bnCollectClockEls();
    }

    // If the clock element is not present yet, retry shortly (no layout change).
    if (!__bnClockEls || __bnClockEls.length === 0) {
      if (__bnClockTimer) { clearTimeout(__bnClockTimer); }
      __bnClockTimer = setTimeout(updateBanglaClock, 500);
      return;
    }

    var hour = now.getHours();
    var period = "";
    if (hour >= 4 && hour < 6) period = "ভোর";
    else if (hour >= 6 && hour < 12) period = "সকাল";
    else if (hour >= 12 && hour < 16) period = "দুপুর";
    else if (hour >= 16 && hour < 18) period = "বিকেল";
    else if (hour >= 18 && hour < 20) period = "সন্ধ্যা";
    else period = "রাত";

    var h = hour % 12; h = h ? h : 12;
    var m = now.getMinutes(); m = m < 10 ? "0" + m : m;
    var s = now.getSeconds(); s = s < 10 ? "0" + s : s;

    var timeString = period + " " + toBanglaNum(h) + ":" + toBanglaNum(m) + ":" + toBanglaNum(s);

    var dateString = "";
    try { dateString = now.toLocaleDateString('bn-BD', __bnClockOptions); } catch(e) { dateString = ""; }
    if (!dateString || __bnClockEnRe.test(dateString)) {
      dateString = __bnClockDaysBn[now.getDay()] + ', ' + toBanglaNum(now.getDate()) + ' ' + __bnClockMonthsBn[now.getMonth()] + ', ' + toBanglaNum(now.getFullYear());
    }

    var html =
      '<i class="fa-solid fa-calendar" aria-hidden="true"></i> <span style="font-weight:bold;">' +
      dateString +
      '</span> | <i class="fa-solid fa-clock" aria-hidden="true"></i> ' +
      timeString;

    for (var k = 0; k < __bnClockEls.length; k++) {
      var el = __bnClockEls[k];
      if (!el) continue;
      el.innerHTML = html;
      if (el.classList) el.classList.add('clock-visible');
    }

    if (__bnClockTimer) { clearTimeout(__bnClockTimer); }
    __bnClockTimer = setTimeout(updateBanglaClock, 1000 - now.getMilliseconds());
  }
  // Run immediately to avoid desktop English flash; keep single timer via __bnClockTimer.
  try { updateBanglaClock(); } catch(e){console.error(e);}
  // Also re-run on pageshow (bfcache restores).
  window.addEventListener("pageshow", function(){ try { updateBanglaClock(); } catch(e){console.error(e);} });
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
jQuery(document).ready(function($) {
  // Search overlay controls (menu open/close is handled elsewhere to avoid duplicate bindings).
  $('.search-button').on('click', function() {
    $('.search-container-overlay').addClass('search-container-overlay-show');
  });

  $('.search-container-close').on('click', function() {
    $('.search-container-overlay').removeClass('search-container-overlay-show');
  });
});


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){
  function esc(s){ return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function pickAltLink(links){
    if(!links || !links.length) return '';
    for(var i=0;i<links.length;i++){
      if(links[i] && links[i].rel === 'alternate' && links[i].href){ return links[i].href; }
    }
    return (links[0] && links[0].href) ? links[0].href : '';
  }
  function thumbFromEntry(entry, size){
    size = size || 300;
    try{
      if(entry && entry.media$thumbnail && entry.media$thumbnail.url){
        var u = entry.media$thumbnail.url;
        // common Blogger thumb patterns
        u = u.replace(/\/s\d+-c\//, '/s'+size+'-c/');
        u = u.replace(/=s\d+-c/, '=s'+size+'-c');
        u = u.replace(/s72-c/, 's'+size+'-c');
        return u;
      }
    }catch(e){console.error(e);}
    return '';
  }
  function parseCfg(raw){
    raw = String(raw||'').replace(/\s+/g,'').trim();
    var parts = raw.split('/').filter(function(x){return x!=='';});
    var cfg = {count:10, section:'', mode:'recent', label:''};
    if(parts.length===0) return cfg;
    // If first part is number
    if(/^\d+$/.test(parts[0])){
      cfg.count = parseInt(parts[0],10) || 10;
      cfg.section = parts[1] || '';
      cfg.mode = (parts[2]||'recent').toLowerCase();
      cfg.label = parts[2] || '';
    }else{
      cfg.section = parts[0] || '';
      cfg.mode = (parts[1]||'recent').toLowerCase();
      cfg.label = parts[1] || '';
    }
    return cfg;
  }
  function buildFeedUrl(cfg, cb){
    var base = '/feeds/posts/summary';
    var qs = '?alt=json-in-script&imgmax=2000&max-results=' + encodeURIComponent(cfg.count) + '&callback=' + encodeURIComponent(cb);
    var m = (cfg.mode||'').toLowerCase();
    if(m === 'recent' || m === 'latest' || m === '' || cfg.label.toLowerCase() === 'recent'){
      return base + qs;
    }
    // treat as label
    return base + '/-/' + encodeURIComponent(cfg.label) + qs;
  }
  function showError(container, msg){
    if(!container) return;
    container.innerHTML = '<div class="direct-error">'+esc(msg)+'</div>';
  }
  function loadInto(sectionId){
    var sec = document.getElementById(sectionId);
    if(!sec) return;
    var cfgEl = sec.querySelector('.ai-config');
    var outHot = sec.querySelector('.hot-posts-output');
    var outFeat = sec.querySelector('.featured-output');
    // ✅ Guard: নতুন hot/featured markup না থাকলে ফিড কল করবে না
if(!cfgEl || (!outHot && !outFeat)) return;
var raw = cfgEl ? (cfgEl.textContent || cfgEl.innerText || '') : '';
    var cfg = parseCfg(raw);
    var cbName = '__cb_'+sectionId.replace(/[^a-z0-9]/ig,'')+'_'+Math.floor(Math.random()*1e9);
    window[cbName] = function(json){
      try{
        var feed = json && json.feed;
        var entries = feed && feed.entry ? feed.entry : [];
        if(!entries || !entries.length){
          showError(outHot||outFeat, 'কোনো পোস্ট পাওয়া যায়নি। Settings → Site feed → Allow blog feed = Full করুন।');
          return;
        }
        if(sectionId === 'hot-posts' && outHot){
          var html = '';
          for(var i=0;i<entries.length;i++){
            var e = entries[i];
            var title = e && e.title && e.title.$t ? e.title.$t : '';
            var link = pickAltLink(e && e.link);
            // FIX: Generate thumbnail for Hot Posts
            var thumb = thumbFromEntry(e, 100);
            if(!thumb){ thumb = 'https://resources.blogblog.com/img/icon_delete13.gif'; }

            html += '<div class="hot-item item'+i+'">';
            html += '<a class="post-filter-link hot-thumb" href="'+esc(link)+'" title="'+esc(title)+'">';
            html += '<img class="snip-thumbnail hot-thumb-img" src="'+esc(thumb)+'" alt="'+esc(title)+'" width="100" height="100"/>';
            html += '</a>';
            html += '<h2 class="entry-title"><a href="'+esc(link)+'" title="'+esc(title)+'">'+esc(title)+'</a></h2>';
            html += '</div>';
          }
          outHot.innerHTML = html;
        }else if(sectionId === 'ft-post' && outFeat){
          var html2 = '';
          for(var j=0;j<entries.length;j++){
            var e2 = entries[j];
            var title2 = e2 && e2.title && e2.title.$t ? e2.title.$t : '';
            var link2 = pickAltLink(e2 && e2.link);
            var thumb = thumbFromEntry(e2, 600) || '';
            var label = (e2 && e2.category && e2.category.length && e2.category[0].term) ? e2.category[0].term : '';
            html2 += '<div class="megawrap item'+j+'">';
            html2 += '<a class="post-filter-link background-layer image-nos" href="'+esc(link2)+'" title="'+esc(title2)+'">';
            if(thumb){
              html2 += '<img class="snip-thumbnail" src="'+esc(thumb)+'" alt="'+esc(title2)+'" width="300" height="169"/>';
            }
            html2 += '</a>';
            html2 += '<div class="featured-meta">';
            if(label){ html2 += '<span class="label-news-flex">'+esc(label)+'</span>'; }
            html2 += '<h2 class="entry-title"><a href="'+esc(link2)+'" title="'+esc(title2)+'">'+esc(title2)+'</a></h2>';
            html2 += '</div></div>';
          }
          outFeat.innerHTML = html2;
        }
      }catch(err){
        showError(outHot||outFeat, 'স্ক্রিপ্ট এরর: ' + (err && err.message ? err.message : err));
      } finally {
        try{ delete window[cbName]; }catch(e){console.error(e);}
      }
    };
    var s = document.createElement('script');
    s.src = buildFeedUrl(cfg, cbName);
    s.onerror = function(){
      showError(outHot||outFeat, 'Feed লোড হচ্ছে না। Settings → Site feed → Allow blog feed = Full করুন (None হলে কাজ করবে না)।');
      try{ delete window[cbName]; }catch(e){console.error(e);}
    };
    document.body.appendChild(s);
  }
  function init(){
    loadInto('hot-posts');
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
/* Hot Posts: Truncate (89 chars) + Bottom-to-Top Ticker (transform based, mobile friendly) */
(function($){
  $(window).on('load', function() {

    var $tickerWrapper = $(".hot-posts-pro .hot-posts-output");
    if(!$tickerWrapper.length) return;

    // Keep animation on its own layer (less repaint/jitter)
    try{
      $tickerWrapper.css({
        position: 'relative',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)'
      });
    }catch(e){console.error(e);}

    function truncateTitles() {
      $tickerWrapper.find(".hot-item h2 a").each(function() {
        var $link = $(this);
        var text = $.trim($link.text());
        if (text.length > 89) {
          $link.text(text.substring(0, 89) + "...");
        }
      });
    }

    var isSmall = (window.matchMedia && window.matchMedia('(max-width:1024px)').matches);

    // Wait until items exist, then start ticker
    var checkExist = setInterval(function() {
      var $items = $tickerWrapper.find(".hot-item");

      if ($items.length > 1) {
        clearInterval(checkExist);

        truncateTitles();

        // On mobile/tablet keep exactly 8 items (prevents layout issues)
        if(isSmall && $items.length > 8){
          $items.slice(8).remove();
          $items = $tickerWrapper.find(".hot-item");
        }

        // Ensure widget is a stable box (prevents nearby sections moving)
        var $widget = $tickerWrapper.closest('.widget');
        if($widget.length){
          $widget.css({ overflow: 'hidden' });
          if(isSmall){
            // Set height based on (title + 8 items) so no empty space
            var titleH = $widget.children('.widget-title').outerHeight(true) || 0;
            var itemH  = $items.first().outerHeight(true) || 34;
            var desiredCount = Math.min(8, $items.length);
            var newH = Math.round(titleH + (desiredCount * itemH) + 6);
            $widget.css({ height: newH + 'px' });
          }
        }

        // Reset any previous movement
        $tickerWrapper.stop(true, true).css({ "marginTop": "0", "top": "0" });

        var animMs = 800;
        var gapMs = 3000;
        var isAnimating = false;

        function scrollTicker(){
          if(isAnimating) return;

          $items = $tickerWrapper.find(".hot-item");
          if ($items.length <= 1) return;

          var firstItemHeight = $items.first().outerHeight(true);
          if(!firstItemHeight || firstItemHeight < 10) firstItemHeight = 70;

          isAnimating = true;

          // Animate with transform (doesn't affect layout like marginTop)
          $tickerWrapper.css({
            transition: 'transform ' + animMs + 'ms ease',
            transform: 'translate3d(0,' + (-firstItemHeight) + 'px,0)'
          });

          setTimeout(function(){
            // Move first item to bottom
            $items.first().appendTo($tickerWrapper);

            // Reset transform without animation
            $tickerWrapper.css({
              transition: 'none',
              transform: 'translate3d(0,0,0)'
            });

            // Force reflow so the next transition works reliably
            try{ $tickerWrapper[0].offsetHeight; }catch(e){console.error(e);}
            isAnimating = false;
          }, animMs + 30);
        }

        var tickerInterval = setInterval(scrollTicker, gapMs);

        // Hover pause (desktop)
        $tickerWrapper.on('mouseenter', function() {
          clearInterval(tickerInterval);
        }).on('mouseleave', function() {
          tickerInterval = setInterval(scrollTicker, gapMs);
        });
      }
    }, 500);

  });
})(jQuery);


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){
  'use strict';
  function esc(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function parseConfig(raw){
    raw = String(raw||'').replace(/\s+/g,'').trim();
    var parts = raw.split('/').filter(function(x){return x!=='';});
    var cfg = {count: 8, label: 'recent'};
    if(!parts.length) return cfg;

    if(/^\d+$/.test(parts[0])){
      cfg.count = parseInt(parts[0],10) || cfg.count;
      // expected: count/section/labelOrMode
      cfg.label = (parts[2] || parts[1] || cfg.label);
    }else{
      // expected: section/labelOrMode
      cfg.label = (parts[1] || parts[0] || cfg.label);
    }
    if(!cfg.label) cfg.label = 'recent';
    return cfg;
  }

  function buildFeedUrl(cfg){
    var base = location.origin + '/feeds/posts/default';
    var qs = '?alt=json&max-results=' + encodeURIComponent(cfg.count||8);
    var lab = String(cfg.label||'recent');
    var m = lab.toLowerCase();
    if(m === 'recent' || m === 'latest' || m === 'new' || m === 'default'){
      return base + qs;
    }
    return base + '/-/' + encodeURIComponent(lab) + qs;
  }

  function formatDate(isoDate){
    try{
      var d = new Date(isoDate);
      if(isNaN(d.getTime())) return '';
      var months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
      return d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
    }catch(e){
      return '';
    }
  }

  function pickAltLink(links){
    if(!links || !links.length) return '#';
    for(var i=0;i<links.length;i++){
      if(links[i] && links[i].rel === 'alternate') return links[i].href;
    }
    return links[0].href || '#';
  }

  function getImage(entry){
    var fallback = "https://resources.blogblog.com/img/icon_delete13.gif";
    try{
      if(entry && entry.media$thumbnail && entry.media$thumbnail.url){
        // Higher quality, still light
        return entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//, "/w140-h105-p-k-no-nu/");
      }
      var html = entry && entry.content && entry.content.$t ? entry.content.$t : '';
      var m = html.match(/<img[^>]+src="([^"]+)"/i);
      if(m && m[1]) return m[1];
    }catch(e){console.error(e);}
    return fallback;
  }

  function startScrollIfNeeded(root, viewport, list, singleHtml){
    // If content does not overflow, keep it static
    var needsScroll = (list.scrollHeight > viewport.clientHeight + 5);
    if(!needsScroll) return;

    // Duplicate once for seamless loop
    list.innerHTML = singleHtml + singleHtml;
    list.classList.add('mh-scroll');

    // Duration: ~1s per 30px (clamped)
    var totalHeight = list.scrollHeight / 2;
    var dur = Math.max(18, Math.min(60, totalHeight / 30));
    list.style.animationDuration = dur + 's';
  }

  function render(root, data){
    var viewport = root.querySelector('.mh-viewport');
    var list = root.querySelector('.mh-list');
    var loader = root.querySelector('.mh-loading');
    if(!viewport || !list || !loader) return;

    var entries = data && data.feed && data.feed.entry ? data.feed.entry : [];
    if(!entries.length){
      loader.textContent = "কোনো পোস্ট পাওয়া যায়নি";
      return;
    }

    var html = '';
    for(var i=0;i<entries.length;i++){
      var e = entries[i];
      var title = (e && e.title && e.title.$t) ? e.title.$t : '';
      var link = pickAltLink(e && e.link);
      var img = getImage(e);
      var date = formatDate(e && e.published && e.published.$t);
      html += ''
        + '<div class="mh-item">'
        +   '<div class="mh-thumb"><a href="' + esc(link) + '" aria-label="' + esc(title) + '"><img src="' + esc(img) + '" alt="' + esc(title) + '" loading="lazy"/></a></div>'
        +   '<div class="mh-info">'
        +     '<h3 class="mh-title"><a href="' + esc(link) + '">' + esc(title) + '</a></h3>'
        +     (date ? '<span class="mh-date">🕒 ' + esc(date) + '</span>' : '')
        +   '</div>'
        + '</div>';
    }

    loader.style.display = 'none';
    list.classList.remove('mh-scroll');
    list.style.animationDuration = '';
    list.innerHTML = html;

    // Wait a tick so heights are measurable, then decide scrolling
    setTimeout(function(){ startScrollIfNeeded(root, viewport, list, html); }, 0);
  }

  function initOne(root){
    if(!root || root.getAttribute('data-mh-init') === '1') return;
    root.setAttribute('data-mh-init','1');

    var cfgEl = root.querySelector('.mh-config');
    var cfg = parseConfig(cfgEl ? cfgEl.textContent : '');
    var url = buildFeedUrl(cfg);

    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(json){ render(root, json); })
      .catch(function(){
        var loader = root.querySelector('.mh-loading');
        if(loader) loader.textContent = "এরর লোডিং!";
      });
  }

  function initAll(){
    var blocks = document.querySelectorAll('.mh-wrap[data-mh-hotposts="true"]');
    for(var i=0;i<blocks.length;i++) initOne(blocks[i]);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  }else{
    initAll();
  }
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function() {
  var deferredRan = false;

  /* 1) IntersectionObserver lazy loader for scripts/iframes/images */
  function initIntersectionLazy() {
    var lazyEls = [].slice.call(document.querySelectorAll(&#39;script[data-src], iframe[data-src], img[data-src], .lazy-widget, .lazy-ad&#39;));
    if (!lazyEls.length) return;
    if (!(&#39;IntersectionObserver&#39; in window)) {
      window.addEventListener(&#39;load&#39;, function() {
        lazyEls.forEach(function(el) {
          try {
            if (el.tagName === &#39;SCRIPT&#39;) {
              var s = document.createElement(&#39;script&#39;);
              s.src = el.getAttribute(&#39;data-src&#39;);
              s.defer = true;
              document.body.appendChild(s);
            } else if (el.tagName === &#39;IFRAME&#39; || el.tagName === &#39;IMG&#39;) {
              el.src = el.getAttribute(&#39;data-src&#39;);
            } else {
              el.classList.remove(&#39;lazy-widget&#39;);
            }
          } catch(e){console.error(e);}
        });
      }, {once:true});
      return;
    }
    var io = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        try {
          if (el.tagName === &#39;SCRIPT&#39;) {
            var s = document.createElement(&#39;script&#39;);
            s.src = el.getAttribute(&#39;data-src&#39;);
            s.defer = true;
            s.crossOrigin = &#39;anonymous&#39;;
            document.body.appendChild(s);
          } else if (el.tagName === &#39;IFRAME&#39; || el.tagName === &#39;IMG&#39;) {
            el.src = el.getAttribute(&#39;data-src&#39;);
          } else if (el.classList) {
            el.classList.remove(&#39;lazy-widget&#39;);
          }
        } catch(e){console.error(e);}
        obs.unobserve(el);
      });
    }, {rootMargin:&#39;200px&#39;});
    lazyEls.forEach(function(el) { io.observe(el); });
  }

  /* 2) Deferred widgets (Ticker / Hot Posts / Featured scripts moved from widgets) */
  function runDeferredWidgets() {
    if (deferredRan) return;
    deferredRan = true;
    try {
//<![CDATA[
    (function () {
      function stripHtml(s){ return String(s || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }
      function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]); }); }
      function normalizeSpeed(s){ s = (s || '').trim(); if(!s) return '40s'; if(/^\d+$/.test(s)) return s + 's'; if(/^\d+(ms|s)$/.test(s)) return s; return '40s'; }
      function buildFeedUrl(count, mode, label){
        var host = window.location.origin;
        var base = host + '/feeds/posts/default?alt=json&max-results=' + count;
        label = (label || '').trim(); mode = (mode || '').trim().toLowerCase();
        if(mode === 'label' && label && label.toLowerCase() !== 'recent' && label.toLowerCase() !== 'latest'){ return host + '/feeds/posts/default/-/' + encodeURIComponent(label) + '?alt=json&max-results=' + count; }
        if(mode === 'recent' || mode === 'latest' || mode === ''){ return base; }
        if(mode === 'trending'){ return host + '/feeds/posts/default?alt=json&max-results=' + Math.max(30, count*5); }
        if(label && label.toLowerCase() !== 'recent' && label.toLowerCase() !== 'latest'){ return host + '/feeds/posts/default/-/' + encodeURIComponent(label) + '?alt=json&max-results=' + count; }
        return base;
      }
      function initTicker(tickerWindow){
        var moveBox = tickerWindow.querySelector('.ticker-move');
        var raw = tickerWindow.getAttribute('data-config') || '10/trending/recent/40s';
        var parts = stripHtml(raw).split('/').map(function(x){ return String(x||'').trim(); });
        var count = parseInt(parts[0] || '10', 10); if(!count || count < 1) count = 10;
        var mode = (parts[1] || 'recent').toLowerCase();
        var label = (parts[2] || 'recent');
        var speed = normalizeSpeed(parts[3] || '40s');

        var load = function(){
          fetch(buildFeedUrl(count, mode, label)).then(function(r){ return r.json(); }).then(function(data){
            var entries = (data && data.feed && data.feed.entry) ? data.feed.entry : [];
            if(!entries.length){ moveBox.innerHTML = '<span class="loading-msg">কোনো পোস্ট পাওয়া যায়নি</span>'; return; }
            if(mode === 'trending'){
              entries.sort(function(a,b){
                var ca = (a.thr$total && a.thr$total.$t) ? parseInt(a.thr$total.$t,10) : 0;
                var cb = (b.thr$total && b.thr$total.$t) ? parseInt(b.thr$total.$t,10) : 0;
                return cb - ca;
              });
            }
            entries = entries.slice(0, count);
            var html = '';
            entries.forEach(function(post){
              var title = escapeHtml(post.title && post.title.$t ? post.title.$t : '');
              var link = '#'; (post.link || []).forEach(function(l){ if (l.rel === 'alternate') link = l.href; });
              var thumb = 'https://resources.blogblog.com/img/icon_delete13.gif';
              if(post.media$thumbnail && post.media$thumbnail.url){ thumb = post.media$thumbnail.url.replace(/\/s\d+(-c)?\//, '/s100/').replace(/=s\d+(-c)?/, '=s100'); }
              else if(post.content && post.content.$t){ var m = post.content.$t.match(/src="([^"]+)"/); if(m && m[1]) thumb = m[1]; }
              html += '<div class="t-item"><img class="t-thumb" src="'+ thumb +'" alt="" loading="lazy" decoding="async" /><a class="t-link" href="'+ link +'">'+ title +'</a></div>';
            });
            moveBox.innerHTML = html + html;
            moveBox.style.animation = 'seamless-scroll ' + speed + ' linear infinite';
            moveBox.addEventListener('mouseenter', function(){ moveBox.style.animationPlayState = 'paused'; });
            moveBox.addEventListener('mouseleave', function(){ moveBox.style.animationPlayState = 'running'; });
          }).catch(function(){ moveBox.innerHTML = '<span class="loading-msg">লোড এরর!</span>'; });
        };
        if('IntersectionObserver' in window){
          var obs = new IntersectionObserver(function(es){ if(es.some(function(e){ return e.isIntersecting; })){ obs.disconnect(); load(); } }, { rootMargin: '200px' });
          obs.observe(tickerWindow);
        } else { load(); }
      }
      document.querySelectorAll('.js-ticker').forEach(initTicker);
    })();
    //]]>

//<![CDATA[
(function () {
  var root = document.getElementById('hot-posts');
  if (!root) return;

  var configEl = root.querySelector('.mh-config-data');
  var rawConfig = configEl ? ((configEl.textContent || configEl.innerText || '') + '').trim() : '10/hot-posts/recent';
  if (!rawConfig) rawConfig = '10/hot-posts/recent';

  var parts = rawConfig.split('/').map(function (s) { return (s || '').trim(); }).filter(function (s) { return !!s; });

  // Shortcut format: num/type/filter  → 10/hot-posts/recent | 10/hot-posts/random | 10/hot-posts/Technology
  var num = parts[0] ? parseInt(parts[0], 10) : 10;
  if (isNaN(num) || num < 1) num = 10;

  var filter = (parts[2] ? parts[2] : 'recent').trim();
  var filterLower = (filter + '').toLowerCase();
  var mode = (filterLower === 'random') ? 'random' : 'recent';
  var label = (filterLower !== 'recent' && filterLower !== 'random' && filterLower !== 'all') ? filter : '';

  var fallbackImg = "https://resources.blogblog.com/img/icon_delete13.gif";

  var container = root.querySelector('#hotListContainer');
  var loader = root.querySelector('.hot-loading');
  var wrapper = root.querySelector('.hot-content-area');
  if (!container || !loader || !wrapper) return;

  function jsonp(url) {
    return new Promise(function (resolve, reject) {
      var cb = 'mh_cb_' + Math.random().toString(36).slice(2);
      var script = document.createElement('script');
      var timer = setTimeout(function () { cleanup(); reject('timeout'); }, 15000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        if (script && script.parentNode) script.parentNode.removeChild(script);
      }

      window[cb] = function (data) { cleanup(); resolve(data); };
      script.onerror = function () { cleanup(); reject('error'); };
      script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + cb;
      document.body.appendChild(script);
    });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]);
    });
  }

  function pickLink(post) {
    if (!post || !post.link) return '#';
    for (var i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') return post.link[i].href;
    }
    return post.link[0] ? post.link[0].href : '#';
  }

  function pickThumb(post, w, h) {
    var img = fallbackImg;

    function upgrade(u) {
      u = String(u || '');
      // Size-upgrade for Blogger/Googleusercontent URLs (covers /s72-c/, /s720-h480/, /w400-h300/, =s72-c, =w400-h300...)
      u = u.replace(/\/s\d+[^\/]*\//, '/w' + w + '-h' + h + '-p-k-no-nu/');
      u = u.replace(/\/w\d+-h\d+[^\/]*\//, '/w' + w + '-h' + h + '-p-k-no-nu/');
      u = u.replace(/=s\d+[^&]*/, '=w' + w + '-h' + h + '-p-k-no-nu');
      u = u.replace(/=w\d+-h\d+[^&]*/, '=w' + w + '-h' + h + '-p-k-no-nu');
      return u;
    }

    if (post && post.media$thumbnail && post.media$thumbnail.url) {
      return upgrade(post.media$thumbnail.url);
    }
    if (post && post.content && post.content.$t) {
      var m = post.content.$t.match(/src="([^"]+)"/);
      if (m && m[1]) return upgrade(m[1]);
    }
    return img;
  }

  var feedUrl = '/feeds/posts/default';
  if (label) feedUrl += '/-/' + encodeURIComponent(label);
  feedUrl += '?alt=json-in-script&imgmax=2000&max-results=' + encodeURIComponent(num);

  jsonp(feedUrl)
    .then(function (data) {
      var posts = (data && data.feed && data.feed.entry) ? data.feed.entry.slice() : [];
      if (!posts.length) { loader.innerHTML = "কোনো পোস্ট পাওয়া যায়নি"; return; }

      if (mode === 'random') shuffle(posts);

      var html = '';
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        var title = esc(post.title && post.title.$t ? post.title.$t : '');
        var link = pickLink(post);
        var img = pickThumb(post, 170, 110);

        html += ''
          + '<div class="hot-item">'
          + '  <a class="hot-thumb" href="' + link + '" title="' + title + '">'
          + '    <img src="' + img + '" alt="' + title + '" loading="lazy"/>'
          + '  </a>'
          + '  <div class="hot-meta">'
          + '    <h3 class="hot-title"><a href="' + link + '" title="' + title + '">' + title + '</a></h3>'
          + '  </div>'
          + '</div>';
      }

      // seamless scroll: duplicate
      container.innerHTML = html + html;
      loader.style.display = 'none';

      // animation only when content exceeds container height
      var totalHeight = container.scrollHeight / 2;
      if (totalHeight > wrapper.clientHeight) {
        var duration = totalHeight / 40; // speed control
        container.classList.add('is-scrolling');
        container.style.animationDuration = (duration > 15 ? duration : 15) + 's';
      }
    })
    .catch(function () {
      loader.innerHTML = "লোড হতে সমস্যা হচ্ছে";
    });
})();
//]]>

//<![CDATA[
(function () {
  var root = document.getElementById('ft-post');
  if (!root) return;

  // make sure widget becomes visible (theme uses .open-iki to override display:none)
  var widgetBox = root.querySelector('.widget');
  if (widgetBox && widgetBox.classList) widgetBox.classList.add('open-iki');

  var configEl = root.querySelector('.mf-config-data');
  var rawConfig = configEl ? ((configEl.textContent || configEl.innerText || '') + '').trim() : '9/featured/recent';
  if (!rawConfig) rawConfig = '9/featured/recent';

  var parts = rawConfig.split('/').map(function (s) { return (s || '').trim(); }).filter(function (s) { return !!s; });

  // Shortcut format: num/type/filter  → 9/featured/recent | 9/featured/random | 9/featured/Technology
  var num = parts[0] ? parseInt(parts[0], 10) : 9;
  if (isNaN(num) || num < 1) num = 9;

  var filter = (parts[2] ? parts[2] : 'recent').trim();
  var filterLower = (filter + '').toLowerCase();
  var mode = (filterLower === 'random') ? 'random' : 'recent';
  var label = (filterLower !== 'recent' && filterLower !== 'random' && filterLower !== 'all') ? filter : '';

  var fallbackImg = "https://resources.blogblog.com/img/icon_delete13.gif";

  var holder = root.querySelector('#featuredHolder');
  var loader = root.querySelector('.featured-loading');
  if (!holder || !loader) return;

  function jsonp(url) {
    return new Promise(function (resolve, reject) {
      var cb = 'mf_cb_' + Math.random().toString(36).slice(2);
      var script = document.createElement('script');
      var timer = setTimeout(function () { cleanup(); reject('timeout'); }, 15000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        if (script && script.parentNode) script.parentNode.removeChild(script);
      }

      window[cb] = function (data) { cleanup(); resolve(data); };
      script.onerror = function () { cleanup(); reject('error'); };
      script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + cb;
      document.body.appendChild(script);
    });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]);
    });
  }

  function pickLink(post) {
    if (!post || !post.link) return '#';
    for (var i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') return post.link[i].href;
    }
    return post.link[0] ? post.link[0].href : '#';
  }

  function pickThumb(post, w, h) {
    var img = fallbackImg;

    function upgrade(u) {
      u = String(u || '');
      // Size-upgrade for Blogger/Googleusercontent URLs (covers /s72-c/, /s720-h480/, /w400-h300/, =s72-c, =w400-h300...)
      u = u.replace(/\/s\d+[^\/]*\//, '/w' + w + '-h' + h + '-p-k-no-nu/');
      u = u.replace(/\/w\d+-h\d+[^\/]*\//, '/w' + w + '-h' + h + '-p-k-no-nu/');
      u = u.replace(/=s\d+[^&]*/, '=w' + w + '-h' + h + '-p-k-no-nu');
      u = u.replace(/=w\d+-h\d+[^&]*/, '=w' + w + '-h' + h + '-p-k-no-nu');
      return u;
    }

    if (post && post.media$thumbnail && post.media$thumbnail.url) {
      return upgrade(post.media$thumbnail.url);
    }
    if (post && post.content && post.content.$t) {
      var m = post.content.$t.match(/src="([^"]+)"/);
      if (m && m[1]) return upgrade(m[1]);
    }
    return img;
  }

  function pickLabel(post) {
    if (post && post.category && post.category.length && post.category[0] && post.category[0].term) {
      return post.category[0].term;
    }
    return '';
  }

  function pickAuthor(post) {
    if (post && post.author && post.author[0] && post.author[0].name && post.author[0].name.$t) {
      return post.author[0].name.$t;
    }
    return '';
  }

  function formatDate(pub) {
    try {
      var d = new Date(pub);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return ''; }
  }

  var feedUrl = '/feeds/posts/default';
  if (label) feedUrl += '/-/' + encodeURIComponent(label);
  feedUrl += '?alt=json-in-script&imgmax=2000&max-results=' + encodeURIComponent(num);

  jsonp(feedUrl)
    .then(function (data) {
      var posts = (data && data.feed && data.feed.entry) ? data.feed.entry.slice() : [];
      if (!posts.length) { loader.innerHTML = "কোনো পোস্ট পাওয়া যায়নি"; return; }

      if (mode === 'random') shuffle(posts);

      var html = '';
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        var link = pickLink(post);
        var title = esc(post.title && post.title.$t ? post.title.$t : '');
        var isHero = (i === 1);
        var thumb = pickThumb(post, (isHero ? 1600 : 600), (isHero ? 900 : 600));
        var labelTxt = esc(pickLabel(post));
        var author = esc(pickAuthor(post));
        var dateTxt = formatDate(post.published && post.published.$t ? post.published.$t : '');

        html += ''
          + '<div class="megawrap item' + i + '">'
          + '  <span class="label-news">' + labelTxt + '</span>'
          + '  <a class="post-filter-link background-layer ' + (thumb.indexOf('ytimg.com') > -1 ? 'video-nos' : 'image-nos') + '" href="' + link + '">'
          + '    <img class="snip-thumbnail" alt="' + title + '" src="' + thumb + '"/>'
          + '  </a>'
          + '  <div class="featured-meta">'
          + '    <div class="hero-feat-box">'
          + '      <h2 class="entry-title"><a href="' + link + '">' + title + '</a></h2>'
          + '      <div class="post-snip"><span class="post-author">' + author + '</span><span class="post-date">' + dateTxt + '</span></div>'
          + '    </div>'
          + '  </div>'
          + '</div>';
      }

      holder.innerHTML = html;
      loader.style.display = 'none';
    })
    .catch(function () {
      loader.innerHTML = "লোড হতে সমস্যা হচ্ছে";
    });
})();
//]]>
    } catch(e){console.error(e);}
  }

  if (document.readyState === &#39;loading&#39;) {
    document.addEventListener(&#39;DOMContentLoaded&#39;, initIntersectionLazy, {once:true});
  } else {
    initIntersectionLazy();
  }

  function scheduleDeferred() {
    if (&#39;requestIdleCallback&#39; in window) {
      requestIdleCallback(runDeferredWidgets, {timeout: 3000});
    } else {
      window.addEventListener(&#39;load&#39;, function() { setTimeout(runDeferredWidgets, 1200); }, {once:true});
    }
  }
  scheduleDeferred();

  // Backup: trigger deferred widgets on DOMContentLoaded
  document.addEventListener(&#39;DOMContentLoaded&#39;, function () {
    setTimeout(runDeferredWidgets, 0);
  }, {once:true});

  window.addEventListener(&#39;scroll&#39;, function() { setTimeout(runDeferredWidgets, 400); }, {passive:true, once:true});
  window.addEventListener(&#39;mousemove&#39;, function() { setTimeout(runDeferredWidgets, 400); }, {passive:true, once:true});
  window.addEventListener(&#39;touchstart&#39;, function() { setTimeout(runDeferredWidgets, 400); }, {passive:true, once:true});
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){
  var bar = document.getElementById('readingProgressBar');
  if(!bar) return;

  var ticking = false;

  function update(){
    ticking = false;
    var doc = document.documentElement;
    var scrollTop = (window.pageYOffset || doc.scrollTop || 0);
    var docHeight = (doc.scrollHeight || 0) - (window.innerHeight || doc.clientHeight || 0);
    var p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if(p < 0) p = 0;
    if(p > 100) p = 100;
    bar.style.width = p.toFixed(2) + '%';
  }

  function onScroll(){
    if(!ticking){
      ticking = true;
      (window.requestAnimationFrame || function(fn){return setTimeout(fn,16);})(update);
    }
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  // Initial paint
  onScroll();
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
/* Desktop (>=1025px): make #MenuNews-sticky become fixed when it reaches the top.
   This does NOT depend on theme option fixedMenu. */
(function(){
  function ready(fn){
    if(document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    var mq = window.matchMedia ? window.matchMedia('(min-width: 1025px)') : null;
    var isDesktop = mq ? mq.matches : (window.innerWidth || document.documentElement.clientWidth || 0) >= 1025;
    if(!isDesktop) return;

    var header = document.getElementById('MenuNews-sticky');
    if(!header) return;

    var hero = header.querySelector('.headerHero');
    var wrap = header.querySelector('.headerHero-wrap');
    if(!hero || !wrap) return;

    var startY = 0;
    var heroH = 56;

    function getScrollY(){
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function recalc(){
      // Temporarily reset to measure its natural position
      hero.classList.remove('fixed-nos','show');

      heroH = hero.offsetHeight || heroH;
      // Keep layout space to avoid content jump when hero becomes fixed
      try{ wrap.style.height = heroH + 'px'; }catch(e){}

      var rect = wrap.getBoundingClientRect();
      startY = rect.top + getScrollY(); // document Y where header touches viewport top
    }

    var ticking = false;
    function apply(){
      ticking = false;
      // If breakpoint changed, disable behavior
      if(mq && !mq.matches){
        hero.classList.remove('fixed-nos','show');
        try{ wrap.style.height = ''; }catch(e){}
        return;
      }
      var y = getScrollY();
      if(y >= startY){
        hero.classList.add('fixed-nos','show');
      }else{
        hero.classList.remove('fixed-nos','show');
      }
    }

    function onScroll(){
      if(!ticking){
        ticking = true;
        (window.requestAnimationFrame || function(fn){return setTimeout(fn,16);})(apply);
      }
    }

    recalc();
    apply();

    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', function(){
      recalc();
      onScroll();
    }, {passive:true});

    // Recalc after fonts load (height may change)
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(function(){
        recalc();
        onScroll();
      });
    }

    // React to breakpoint changes
    if(mq){
      if(typeof mq.addEventListener === 'function'){
        mq.addEventListener('change', function(){
          recalc();
          onScroll();
        });
      }else if(typeof mq.addListener === 'function'){
        mq.addListener(function(){
          recalc();
          onScroll();
        });
      }
    }
  });
})();


/* ---- extracted from theme XML: <script type='text/javascript'> ---- */
(function(){
  // Ensure helper exists (fallback)
  if (typeof __bnDigits !== 'function') {
    window.__bnDigits = function(str){ return String(str).replace(/\d/g, function(d){ return "০১২৩৪৫৬৭৮৯"[d]; }); };
  }
  if (typeof __bnNormalizeDateText !== 'function') {
    window.__bnNormalizeDateText = function(t){
      t = String(t || "");
      t = __bnDigits(t).replace(/\s*,\s*/g, ",");
      t = t.replace(/(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)\s+০([০-৯])/g, "$1 $2");
      return t.trim();
    };
  }

  function fixBox(box){
    if(!box || box.nodeType !== 1) return;
    var target = box.querySelector('time') || box;
    // don't destroy nested HTML; only adjust the leaf node's text
    if (target && target.nodeType === 1) {
      // if leaf has children, skip
      if (target.children && target.children.length) return;
      var t = target.textContent;
      if (!t || !/\d/.test(t)) return;
      // only act if it's likely a date (has a month name or is inside post-date)
      if (!/(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)/.test(t) && !box.classList.contains('post-date')) return;
      var nt = __bnNormalizeDateText(t);
      if (nt && nt !== t) target.textContent = nt;
    }
  }

  function scan(root){
    var scope = root && root.querySelectorAll ? root : document;
    var boxes = scope.querySelectorAll('.post-date, time.published, time.updated');
    for (var i=0;i<boxes.length;i++){
      // if it's a time element, fix directly; otherwise treat as box
      var el = boxes[i];
      if (el.tagName && el.tagName.toLowerCase() === 'time') {
        if (el.children && el.children.length) continue;
        var t = el.textContent;
        if (t && /\d/.test(t)) {
          var nt = __bnNormalizeDateText(t);
          if (nt && nt !== t) el.textContent = nt;
        }
      } else {
        fixBox(el);
      }
    }
  }

  function init(){
    scan(document);
    if (window.MutationObserver) {
      var obs = new MutationObserver(function(muts){
        for (var i=0;i<muts.length;i++){
          var mu = muts[i];
          if (mu.addedNodes && mu.addedNodes.length){
            for (var j=0;j<mu.addedNodes.length;j++){
              var n = mu.addedNodes[j];
              if (n && n.nodeType === 1) scan(n);
            }
          }
          if (mu.type === 'characterData' && mu.target && mu.target.parentNode) {
            scan(mu.target.parentNode);
          }
        }
      });
      obs.observe(document.documentElement, {childList:true, subtree:true, characterData:true});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
