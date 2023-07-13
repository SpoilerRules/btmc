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
//@ version 2.1
//@ description YEP
var critz = rise.registerModule(rise.getModule("Interface").getSetting("Remove Spaces") ? "JumpCriticals" : "Jump Criticals", "Enables you to critically hit your opponent when it's time to do some critical damage");

script.handle("onUnload", function () {critz.unregister();})

var Aura = rise.getModule("Kill Aura");
var Criticals = rise.getModule("Criticals");
var Speed = rise.getModule("Speed");
var Fly = rise.getModule("Flight");
var Jumpy = rise.getModule("Long Jump");

critz.registerSetting("mode", "Mode", "Jump", "Jump", "Silent Jump", "AAC", "NCP", "Old Hypixel");
critz.registerSetting("number", "Delay", 600, 0, 3000, 0.1)
critz.registerSetting("boolean", "Sword & Axe Only", true);
critz.registerSetting("boolean", "Aura Only", true);
critz.registerSetting("boolean", "No Move Check", false);
critz.registerSetting("boolean", "Force No Move", false);
/*critz.registerSetting("boolean", "Sprint Check", false);  awaiting for setSprinting() and isSprinting()
critz.registerSetting("boolean", "Force No Sprint", false);*/

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

var time = -1;

// Random Util of LiquidBounce
function nextDouble(startInclusive, endInclusive) {return startInclusive + (endInclusive - startInclusive) * Math.random();}

// MS Timer
function hasTimePassed(ms) {return rise.getSystemMillis() >= time + ms;}

function hasTimeLeft(ms) {return ms + time - rise.getSystemMillis();}

function timeReset() {time = rise.getSystemMillis();}

function zero() {time = -1;}

critz.handle("onAttack", function (ag) {
    var target = ag.getTarget();
    var posX = player.getPosition().getX();
    var posY = player.getPosition().getY();
    var posZ = player.getPosition().getZ();
    var auraOnly = critz.getSetting("Aura Only");
    var auraToggle = Aura.isEnabled();
    var swordAndAxeOnly = critz.getSetting("Sword & Axe Only");
    if (!input.isKeyBindJumpDown() && !Fly.isEnabled() && !Criticals.isEnabled() && !Speed.isEnabled() && !Jumpy.isEnabled()) {
      if ((auraOnly && auraToggle && world.getTargetEntity(Aura.getSetting("Range"))) || (!auraOnly && target)) {
        if (player.onGround && (!swordAndAxeOnly ? true : (player.isHoldingSword() || isHoldingAxe()))) {
          if (!(critz.getSetting("No Move Check") && !critz.getSetting("Force No Move")) || (!critz.getSetting("Force No Move") && critz.getSetting("No Move Check") && !player.isMoving())) {
            if (critz.getSetting("Mode") == "Jump") {
                player.jump();
            } else {
              if (hasTimePassed(critz.getSetting("Delay"))) {
                critz.getSetting("Force No Move") && player.isMoving() ? player.stop() : null; // ternary operator because i love using ternary operator
                switch (critz.getSetting("Mode")) {
                  case "Silent Jump": // does not bypass any anticheat with critical hit check
                    packet.sendPosition(posX, posY + 0.041999998688698, posZ, false);
                    packet.sendPosition(posX, posY, posZ, false);
                    break;
                  case "AAC": // bypasses loyisa NCP
                    packet.sendPosition(posX, posY + 3e-14, posZ, true);
                    packet.sendPosition(posX, posY + 8e-15, posZ, false);
                    break;
                  case "NCP": // bypasses real NCP
                    packet.sendPosition(posX, posY + 0.0627, posZ, false);
                    packet.sendPosition(posX, posY, posZ, false);
                    break;
                  case "Old Hypixel": // directly pasted from LiquidBounce
                    packet.sendPosition(posX, posY, posZ, false);
                    packet.sendPosition(posX, posY + nextDouble(0.01, 0.06), posZ, false);
                    packet.sendPosition(posX, posY, posZ, false);
                    break;
                }
                timeReset();
              }
            }
          }
        }
      }
   }
// everything done via ternary operator (took 15 mins to create)
//!input.isKeyBindJumpDown() || (!Fly.isEnabled() && !Criticals.isEnabled() && !Speed.isEnabled() && !Jumpy.isEnabled()) ? (auraOnly && auraToggle && world.getTargetEntity(Aura.getSetting("Range"))) || (!auraOnly && target) ? player.onGround && (!swordAndAxeOnly ? true : (player.isHoldingSword() || isHoldingAxe())) ? !(critz.getSetting("No Move Check") && !critz.getSetting("Force No Move")) || (!critz.getSetting("Force No Move") && critz.getSetting("No Move Check") && !player.isMoving()) ? critz.getSetting("Mode") == "Jump" ? player.jump() : hasTimePassed(critz.getSetting("Delay")) ? critz.getSetting("Force No Move") && player.isMoving() ? player.stop() : critz.getSetting("Mode") === "Silent Jump" ? (packet.sendPosition(posX, posY + 0.041999998688698, posZ, false), packet.sendPosition(posX, posY, posZ, false)) : critz.getSetting("Mode") === "AAC" ? (packet.sendPosition(posX, posY + 3e-14, posZ, true), packet.sendPosition(posX, posY + 8e-15, posZ, false)) : critz.getSetting("Mode") === "NCP" ? (packet.sendPosition(posX, posY + 0.0627, posZ, false), packet.sendPosition(posX, posY, posZ, false)) : critz.getSetting("Mode") === "OldHypixel" ? (packet.sendPosition(posX, posY, posZ, false), packet.sendPosition(posX, posY + nextDouble(0.01, 0.06), posZ, false), packet.sendPosition(posX, posY, posZ, false)) : null : null : null : null : null;
});
