Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.randomIndex = function () {
  return Math.floor(Math.random() * this.length);
}


////////////////////////////////////////////////////////////////////
// Teaser takes care about the content that overlays the video
////////////////////////////////////////////////////////////////////

var teaser = {
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/teaser-text?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        this.teasers = xs.map(x => {
          return {title: x[1].title, text: x[1].text}
        });

        //start an interval that changes the teaser text every 7 seconds
        setInterval(() => {
          this.item = this.teasers.randomElement();
          m.redraw();
        }, 8000);

        //do it for the first time
        this.item = this.teasers.randomElement();
        m.redraw();

        
      })
  },
  view: function() {
    let xs = [];
    if(this.item) {
      xs.push(<div class={"teaser-text " + (this.item.title == "Rocklog Consulting" ? "rocklog-consulting" : "planet-rocklog")}>
              <span class="title special">{this.item.title}</span><br/>
              <span class="text">{this.item.text}</span>
              </div>);
    }
    return xs;
  }
};

m.mount(document.getElementById("teaser-content"), teaser);

////////////////////////////////////////////////////////////////////
// FAQ overlays the video as well and might be oversteered by news
////////////////////////////////////////////////////////////////////

var faq = {
  playing: true,
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/quotes?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        this.xs = xs.map(x => x[1]);

        //start an interval that changes the teaser text every 7 seconds
        setInterval(() => {
          if(this.playing) {
            this.index = this.xs.randomIndex();
            m.redraw();
          }
        }, 10000);

        //do it for the first time
        this.index = this.xs.randomIndex();
        m.redraw();

        
      })
  },
  view: function() {
    if(this.index !== undefined) {
      this.item = this.xs[this.index];
      return <div class="faq page-content">
              <div class="head">
              <span class="left">Q&A</span>
              <div class="navi">
                <a onclick={() => {this.index = (this.index - 1) % this.xs.length;}}>
                  <i class="material-icons">keyboard_arrow_left</i>
                </a>
                <a onclick={() => {this.playing = !this.playing}}>
                  <i class="material-icons">{this.playing ? "pause_circle_filled" : "play_arrow"}</i>
                </a>
                <a onclick={() => {this.index = (this.index + 1) % this.xs.length;}}>
                  <i class="material-icons">keyboard_arrow_right</i>
                </a>
              </div>
              </div>
              <div class="q"><div class="text"><i class="material-icons">question_answer</i><span>{this.item["Kunden Quote"]}</span></div></div>
              <div class="a"><div class="text"><i class="material-icons">question_answer</i>
              <span>{this.item["ROCKLOG Kommentar"]}</span></div>
              <div class="tags">
              {this.item["Tag"].split(",").map(x => {
                return <div class="tag"><span>#</span><span>{x}</span></div>
              })}
              </div>
              </div>
              </div>;
    }
  }
};

m.mount(document.getElementById("faq-content"), faq);

////////////////////////////////////////////////////////////////////
// SEO covers the descriptions of the main rocklog branches
////////////////////////////////////////////////////////////////////

var seo = {
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/seo?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        this.seo = xs;
        m.redraw();      
      })
  },
  view: function() {
    if(this.seo) {
      var keyToCss = {"PLANET-ROCKLOG": "planet-rocklog",
                      "Rocklog Consulting": "rocklog-consulting"};
      var xs = this.seo.map(x => {
        return <div class={"seo " + keyToCss[x[1].key]}>
          <span class="title">{x[1].key}</span><br/>
          <span class="text">{x[1].text}</span>
          </div>;
      });
      return xs;
    }
  }
}

m.mount(document.getElementById("seo-content"), seo);

////////////////////////////////////////////////////////////////////
// team
////////////////////////////////////////////////////////////////////

var team = {
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/team?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        this.team = xs;
        m.redraw();      
      })
  },
  view: function() {
    if(this.team) {
      var xs = this.team.sort((x,y) => x[1].pos - y[1].pos).map(x => {
        return <div class="member">
          <div class="name">{x[1].name}</div>
          <div class="function">{x[1]["function"]}</div>
          <div class="img">
          {x[1].image ? <img src={"https://hub0.planet-rocklog.com/OGUxMjNmZW/image-repo/images/" + x[1].image[0]}/> : undefined}
          </div>
          <div class="hello-text">
          <i class="material-icons">format_quote</i>
          <span>{x[1]["hello-text"]}</span>
          </div>
          {x[1]["github"] ? <a href={x[1].github}><div class="link"><span>Github</span><i class="material-icons">launch</i></div></a> : undefined}

          </div>;
      });
      return xs;
    }
  }
}

m.mount(document.getElementById("team-content"), team);

////////////////////////////////////////////////////////////////////
// customers are shown in a one-line banner
////////////////////////////////////////////////////////////////////

var customer = {
  onbeforeremove: function(vnode) {
    console.log("remove " + vnode.attrs.name);
    vnode.dom.classList.add("exit")
    return new Promise(function(resolve) {
      vnode.dom.addEventListener("animationend", resolve)
    })
  },
  view: function(vnode) {
    return <div id={vnode.attrs.name} class="customer exit-on-render">{vnode.attrs.name}</div>;
  }
}

var customers = {
  startIndex: 0,
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/stock?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        this.xs = xs.filter(x => x[1].Kunde).map(x => x[1].Company);

        //start an interval that changes the teaser text every 7 seconds
        setInterval(() => {
          this.startIndex = this.startIndex + 1 % this.xs.length;
          m.redraw();        
        }, 2000);

        m.redraw();      
      });
  },
  onbeforeremove: function(vnode) {
    vnode.dom.classList.add("exit")
    return new Promise(function(resolve) {
      vnode.dom.addEventListener("animationend", resolve)
    })
  },
  view: function() {
    if(this.xs) {
      var xs = [0,1,2,3,4]
          .map(x => this.xs[x + this.startIndex % this.xs.length])
          .map(x => {
            return m(customer, {name: x});
          });
      return xs;
    }
  }
}

m.mount(document.getElementById("customers-content"), customers);

////////////////////////////////////////////////////////////////////
// customers are shown in a one-line banner
////////////////////////////////////////////////////////////////////

var features = {
  getModel: function() {
    return m.request({method: "GET", url: "https://hub0.planet-rocklog.com/OGUxMjNmZW/rest/feature?apikey=SCP1fnGhV3"})
  },
  oninit: function() {
    this.getModel()
      .then(xs => {
        //group by Kategory, map templates to booleans, map groups to array
        let res = xs.reduce((acc,x) => {
          ["Warehousing","Distribution","Tracking","CRM"].map(y => {
            x[1][y] = x[1][y] ? true : false;
          });
          let bucket = acc.get(x[1].Kategorie);
          if(!bucket) {
            bucket = [x];
            acc.set(x[1].Kategorie, bucket);
          } else {
            bucket.push(x);
          }
          return acc;
        }, new Map());

        this.xs = [];
        res.forEach((xs, key) => {
          this.xs.push({category: key, xs: xs, margin: Math.floor(Math.random() * 50)});
        });

        m.redraw();      
      })
  },
  view: function() {
    if(this.xs) {
      let categories = ["Warehousing","Distribution","Tracking","CRM"].map((x,i) => {
        return {value: x, index: i}
      });

      return [<div class="matrix">{this.xs.map((x,i) => {
        return m(category, {category: x.category, xs: x.xs, margin: x.margin, west: i % 2 === 0, bottom: i + 1 > this.xs.length});
      })}</div>, m(domainLegend, {xs: categories})];
    }
  }
}

var category = {
  view: function(vnode) {
    return <div class={"category" + (vnode.attrs.west ? " west" : "") + (vnode.attrs.bottom ? " bottom" : "") }>
      <div class="inlay">
      <div class="title">{vnode.attrs.category}</div>
      {vnode.attrs.xs.reduce((acc,x)=>{
        acc.push(m(feature, {feature: x}));
        return acc;
      }, []) // <div style={["flex-basis: ", vnode.attrs.margin,"%"].join("")}>{String.fromCharCode(160)}</div>
      }
    </div>
      </div>
  }
}

var feature = {
  view: function(vnode) {
    let def = vnode.attrs.feature[1];

    let categories = ["Warehousing","Distribution","Tracking","CRM"].map((x,i) => {
      return def[x] ? {value: x, index: i} : undefined;
    })
    .filter(x => x !== undefined)
    .map(x => m(domainBubble, x));

    return <div class="feature"><div class="domains">{categories}</div><span>{def["text-de"]}</span></div>
  }
}



//a domainBubble is just a knob with a certain color denoting the association with a certain dimension value (domain)
var domainBubble = {
  view: function(vnode) {
    return <i data-toogle="tooltip"
      data-placement="top"
      title={vnode.attrs.value}
      class={"material-icons domain" + ((vnode.attrs.index || 0) % 4)}>fiber_manual_record</i>
  }
}

var domainLegend = {
  view: function(vnode) {
    return <div class="domainLegend">
      {vnode.attrs.xs.map(x => {
        return <div class="group">
          {m(domainBubble, x)}
          <span>{x.value}</span>
        </div>
      })}
    </div>
  }
}


m.mount(document.getElementById("features-content"), features);

////////////////////////////////////////////////////////////////////
// pricing
////////////////////////////////////////////////////////////////////

var pricing = {
  oninit: function(vnode) {
    this.lang = vnode.attrs && vnode.attrs.lang || "de";
  },
  models: {
    "en":
    [{name: "Go!", price: "2'000", user: 3, data: "30'000", retention: "12 Month", support: "Live-Chat (for free)", onpremise: "n/a", benefits: [" Bluetooth and cable scanners"], fee: "225 CHF per hour"},
     {name: "ONE", price: "4'000", user: 50, data: "200'000", retention: "24 Month", support: "Live-Chat (for free)", onpremise: "n/a", benefits: [" Bluetooth and cable scanners."," Phone camera"], fee: "225 CHF per hour"},
     {name: "TWO", price: "6'000", user: "unlimited", data: "500'000", retention: "24 Month", support: "Live-Chat (for free)", onpremise: "n/a", benefits: [" Bluetooth and cable scanners.","  Phone camera"], fee: "225 CHF per hour"},
     {name: "THREE", price: "12'000", user: "unlimited", data: "1'000'000", retention: "36 Month", support: "Live-Chat (for free)", onpremise: "yes, possible",benefits: [" Bluetooth and cable scanners."," Phone camera","25% off on all consulting and customization rates"], fee: "180 CHF per hour"}
     //{name: "ALLinONE", price: "24'000", user: "unlimited", data: "unlimited", retention: "unlimited", support: "Live-Chat (for free)", onpremise: "yes, possible", benefits: ["Dedizierter Hochleistungsserver", "Integrated Datawarehouse"], fee: "160 CHF per hour"},
    ],
    "de":
    [{name: "Go!", price: "2'000", user: 3, data: "30'000", retention: "12 Month", support: "Live-Chat (for free)", onpremise: "-", scanning: ["Bluetooth Scanner",String.fromCharCode(160)], benefits: [String.fromCharCode(160),String.fromCharCode(160),String.fromCharCode(160)], fee: "225 CHF pro Stunde"},
     {name: "ONE", price: "4'000", user: 50, data: "200'000", retention: "24 Month", support: "Live-Chat (for free)", onpremise: "-", scanning: ["Bluetooth Scanner","Mobile Device Camera"], benefits: [String.fromCharCode(160),String.fromCharCode(160),String.fromCharCode(160)], fee: "225 CHF pro Stunde"},
     {name: "TWO", price: "6'000", user: "unbegrenzt", data: "500'000", retention: "24 Month", support: "Live-Chat (for free)", onpremise: "-", scanning: ["Bluetooth Scanner","Mobile Device Camera"], benefits: ["Offline-Fähigkeit", String.fromCharCode(160),String.fromCharCode(160)], fee: "225 CHF pro Stunde"},
     {name: "THREE", price: "12'000", user: "unbegrenzt", data: "1'000'000", retention: "36 Month", support: "Live-Chat (for free)", onpremise: "ja, optional", scanning: ["Bluetooth Scanner","Mobile Device Camera"], benefits: ["Offline-Fähigkeit",String.fromCharCode(160),String.fromCharCode(160)], fee: "180 CHF pro Stunde"}
     //{name: "ALLinONE", price: "24'000", user: "unbegrenzt", data: "unlimited", retention: "unlimited", support: "Live-Chat (for free)", onpremise: "ja, optional", scanning: ["Bluetooth Scanner","Mobile Device Camera"], benefits: ["Offline-Fähigkeit","Dedizierter Hochleistungsserver","Integriertes Datawarehouse"], fee: "160 CHF pro Stunde"},
    ]},
  view: function (vnode) {    
    var fn = x => {
      return <div class="model">
        <div class="section name">{x.name}</div>
        <div class="section price">
          <div class="cap">{this.lang == "de" ? "pro Jahr" : "per year"}</div>
          <div class="content">{x.price + " CHF"}</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Benutzer" : "user"}</div>
          <div class="content">{x.user}</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Cloud hosting" : "cloud hosting"}</div>
          <div class="content">inclusive</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Standard Support" : "Standard support"}</div>
          <div class="content">{x.support}</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Barcode Scanning" : "Barcode scanning"}</div>
          <div class="content">{x.scanning.map(x => <span>{x}</span>)}</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Beratung" : "Service fee"}</div>
          <div class="content">{x.fee}</div>
        </div>
        <div class="section">
          <div class="cap">{this.lang == "de" ? "Extras" : "Benefits"}</div>
          <div class="content">{x.benefits.map(x => <span>{x}</span>)}</div>
        </div>
      </div>
    }
    return this.models[this.lang].map(fn);
  }

}

m.mount(document.getElementById("pricing-content"), pricing);
