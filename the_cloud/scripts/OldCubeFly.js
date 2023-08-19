//@ author Spoili, CzechHek
//@ version 6.9
//@ description YEP
var goat = rise.registerModule("CubeFly", "Patched CubeCraft Fly, utilized by CzechHek's CubeCore 8 script & Spoiler's Fly script back in 2020-2021.");

script.handle("onUnload", function () {goat.unregister();});

var tick = 0;
goat.handle("onStrafe", function (maple) {
    var iM = maple.getForward() !== 0 || maple.getStrafe() !== 0;
    player.setMotionY(0); tick++;
    if (iM) {tick % 3 ? (maple.setSpeed(2.3), mc.setTimerSpeed(0.3)) : (maple.setSpeed(0.25), mc.setTimerSpeed(0.25 - 0.02));} else {maple.setSpeed(0), mc.setTimerSpeed(0.4)}
    
    // Uncomment this line to display the game's timer speed in chat
    // rise.displayChat(mc.getTimerSpeed())
});
