/*
 * Custom Restrictive License
 * 
 * This script file (the "Software") is subject to the terms and conditions of the Custom Restrictive License.
 * For the full text of the license, please visit:
 * https://github.com/SpoilerRules/btmc/blob/main/LICENSE.md
 * 
 * All rights reserved. Unauthorized use, copying, or reproduction of any part of this Software is strictly prohibited.
 */
//@ author Spoili
//@ version 2.61
//@ description Enables you to critically hit your opponent when it's time to do some critical damage
var critz = rise.registerModule(rise.getModule("Interface").getSetting("Remove Spaces") ? "GravyCriticals" : "Gravy Criticals", "Execute the \".script reload\" command if the settings do not appear.");
script.handle("onUnload", function () {critz.unregister();});

var currentTarget = null;
var jumped = false;
var jumpOrHopMode = null;
var ticks = 0;

var spaceCheck = rise.getModule("Interface").getSetting("Remove Spaces");

var Aura = spaceCheck ? rise.getModule("Kill Aura") : rise.getModule("KillAura")
var Criticals = rise.getModule("Criticals");
var Speed = rise.getModule("Speed");
var Fly = rise.getModule("Flight");
var Jumpy = spaceCheck ? rise.getModule("Long Jump") : rise.getModule("LongJump");

critz.registerSetting("mode", "Mode", "Jump", "Jump", "Hop", "Packet Vanilla", "BlocksMC", "Test", "Old Hypixel");
critz.registerSetting("number", "Delay", 600, 0, 3000, 0.1);
critz.registerSetting("number", "Hop Height", 0.34, 0.10, 0.80, 0.01);
critz.registerSetting("boolean", "Smooth Camera", false);
critz.registerSetting("number", "Landing Motion", 0, 0.01, 8, 0.05);
critz.registerSetting("number", "Landing Motion Y", 0.06, 0.01, 6, 0.05);
critz.registerSetting("boolean", "Sword & Axe Only", true);
critz.registerSetting("boolean", "Aura Only", true);
critz.registerSetting("boolean", "No Move Check", false);
critz.registerSetting("boolean", "Force No Move", false);
critz.registerSetting("boolean", "Sprint Check", false);
critz.registerSetting("boolean", "Force No Sprint", false);
critz.registerSetting("boolean", "BlocksMC Warning", true)

var axeIds = [279, 286, 258, 275, 271];

function isHoldingAxe() {
    var heldItemId = player.getHeldItemStack().getItemId();
    for (var i = 0; i < axeIds.length; i++) {
        if (axeIds[i] === heldItemId) {
            return true;
        }
    }
    return false;
}

//function secToNano(seed) {return seed ^ (rise.getSystemMillis() * 1000000);}

var time = -1;

// Random Util of LiquidBounce
function nextDouble(startInclusive, endInclusive) {return startInclusive + (endInclusive - startInclusive) * Math.random();}

// MS Timer
function hasTimePassed(ms) {return rise.getSystemMillis() >= time + ms;}

function hasTimeLeft(ms) {return ms + time - rise.getSystemMillis();}

function timeReset() {time = rise.getSystemMillis();}

function zero() {time = -1;}

critz.handle("onAttack", function (ag) {
  var target = ag.getTarget(); currentTarget = target; jumpOrHopMode = critz.getSetting("Mode") === "Jump" || critz.getSetting("Mode") === "Hop";
  var posX = player.getPosition().getX();
  var posY = player.getPosition().getY();
  var posZ = player.getPosition().getZ();

  if (input.isKeyBindJumpDown() || Fly.isEnabled() || Criticals.isEnabled() || Speed.isEnabled() || Jumpy.isEnabled()) return;
  if (!player.isOnGround() || player.isInWater() || player.isInLava() || player.isInWeb() || player.isOnLadder()) return;
  if (critz.getSetting("Aura Only") ? !(Aura.isEnabled() && world.getTargetEntity(Aura.getSetting("Range"))) : !target) return;
  if (critz.getSetting("Sword & Axe Only") && !(player.isHoldingSword() || isHoldingAxe())) return;
  if (critz.getSetting("No Move Check") && player.isMoving() && !critz.getSetting("Force No Move")) return;
  if (critz.getSetting("Sprint Check") && player.isSprinting() && !critz.getSetting("Force No Sprint")) return;

   if (jumpOrHopMode) {
     critz.getSetting("Mode") === "Jump" ? player.jump() : player.setMotionY(critz.getSetting("Hop Height"));
     jumped = true;
   } else {                                                        /*  !!!  extra protection !!! */
    if (!hasTimePassed(critz.getSetting("Delay")) || !player.isCollidedVertically() || player.isCollidedHorizontally()) return;

    if (critz.getSetting("Force No Move") && player.isMoving()) player.stop();
    if (critz.getSetting("Force No Sprint") && player.isSprinting()) player.setSprinting(false);

    switch (critz.getSetting("Mode")) {
      case "Packet Vanilla":
        packet.sendPosition(posX, posY + 0.041999998688698, posZ, false);
        packet.sendPosition(posX, posY, posZ, false);
        break;
      case "BlocksMC":
        packet.sendPosition(posX, posY + 3e-14, posZ, true);
        packet.sendPosition(posX, posY + 8e-15, posZ, false);
        break;
      case "Test":
        ticks++
        if (ticks < 12) packet.sendPosition(posX, posY, posZ, false);
        if (ticks > 14) packet.sendPosition(posX, posY + 0.06000831, posZ, false), packet.sendPosition(posX, posY, posZ, false), ticks = 0;
        break;
      case "Old Hypixel":
        packet.sendPosition(posX, posY, posZ, false);
        packet.sendPosition(posX, posY + nextDouble(0.01, 0.06), posZ, false);
        packet.sendPosition(posX, posY, posZ, false);
        break;
    }
    timeReset();
  }
});

critz.handle("onPreMotion", function () {
  if (jumpOrHopMode) {
    if (player.isOnGround()) jumped = false;
    if (jumped && critz.getSetting("Smooth Camera")) render.smoothCamera();
  } else jumped = false;
  if (critz.getSetting("BlocksMC Warning") && critz.getSetting("Mode") === "BlocksMC" && hasTimePassed(5000) && critz.getSetting("Delay") < 300) rise.displayChat("§dPlease adjust your Gravy Criticals 'delay' setting to 300-600 if you're on BlocksMC. You can turn off this warning in the Gravy Criticals settings."), timeReset();
});

critz.handle("onStrafe", function () {
  if (critz.getSetting("Landing Motion") === 0) return; if (!jumpOrHopMode) return; if (!jumped) return; if (input.isKeyBindJumpDown() || Fly.isEnabled() || Criticals.isEnabled() || Speed.isEnabled() || Jumpy.isEnabled()) return; if (critz.getSetting("Aura Only") ? !(Aura.isEnabled() && world.getTargetEntity(Aura.getSetting("Range"))) : !currentTarget) return; if (player.isOnGround()) return; if (critz.getSetting("Sword & Axe Only") && !(player.isHoldingSword() || isHoldingAxe())) return; if (critz.getSetting("No Move Check") && player.isMoving() && !critz.getSetting("Force No Move")) return;
  if (player.getMotion().getY() < critz.getSetting("Landing Motion Y")) player.setMotionY(player.getMotion().getY() - critz.getSetting("Landing Motion"));
});
