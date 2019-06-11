Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.randomIndex = function () {
  return Math.floor(Math.random() * this.length);
}

//credit goes to https://stackoverflow.com/users/1134119/aymkdn
function chunk(arr, chunkSize) {
  var R = [];
  for (var i=0,len=arr.length; i<len; i+=chunkSize)
    R.push(arr.slice(i,i+chunkSize));
  return R;
}

////////////////////////////////////////////////////////////////////
// thumbnails displays pictures on the front page
////////////////////////////////////////////////////////////////////

var thumbnails = {
  xs: ["001_Scotchdarning_Strickjacke_grau.png",
       "002_Lorrainestickerei_Kleid_Sonja_Rykiel.png",
       "003_Scotchdarning_Pullover_rot.png",
       "004_Kettenstich_Cashmerepullover_rosa.png",
       "005_Swissdarning_Handschuhe.png",
       "006_Kettenstich_Pullover_gelb.png",
       "007_Filzapplikation_Pullover_schwarz.png",
       "008_Scotchdarning_Pullover_grau.png",
       "009_Nadelfilz_Kinderpullover_blau.png",
       "010_Haekelapplikation_Pullover_schwarz.png",
       "011_Stoffapplikation_Top_weiss.png",
       "012_Stickapplikation_Turnhose_dunkelblau.png",
       "013_Haekelapplikation_Pullover_dunkelblau.png",
       "014_Lorrainestickerei_Rock_Blumenmuster.png",
       "015_Sashiko_Kinderjeans_schwarz.png",
       "016_Swissdarning_Pullover_blau.png"],
  view: function() {
    var xs_ = chunk(this.xs, 4);
    return xs_.map(xs => {
      return <div class="row">
        {xs.map(x => {
          return <div class="col-25" style={`background-image: url(../assets/images/${x})`}>
            &nbsp;
            </div>
        })}
      </div>
    })
  }
};

m.mount(document.getElementById("thumbnails-content"), thumbnails);

