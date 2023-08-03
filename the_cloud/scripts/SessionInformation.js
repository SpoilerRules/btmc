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
//@ version 1.0
//@ description Displays information regarding to your in-game session.
var roguethebat = rise.registerModule(rise.getModule("Interface").getSetting("Remove Spaces") ? "SessionInfo" : "Session Info", "Provides you with information regarding to the session");
script.handle("onUnload", function () {roguethebat.unregister();});

roguethebat.registerSetting("boolean", "Kill/Death Ratio", false);
roguethebat.registerSetting("boolean", "Bar", true);
roguethebat.registerSetting("boolean", "Username", false);
roguethebat.registerSetting("number", "X", 75, 1, 1000, 0.5);
roguethebat.registerSetting("number", "Y", 95, 1, 1000, 0.5);
roguethebat.registerSetting("number", "Additional Wideness", 0, 0, 500, 1);

var startTime = 0;
var elapsedTicks = 0;
var tickps = 20;
var deaths = 0;
var kills = 0;
var isDead = false;
var inServer = network.isMultiplayer() || network.isSingleplayer();

function updateTime() {elapsedTicks++;}
function getTime() {return (Math.floor(elapsedTicks / 20 / 3600) < 10 ? "0" : "") + Math.floor(elapsedTicks / 20 / 3600) + ":" + (Math.floor((elapsedTicks / 20 % 3600) / 60) < 10 ? "0" : "") + Math.floor((elapsedTicks / 20 % 3600) / 60) + ":" + ((elapsedTicks / 20 % 60) < 10 ? "0" : "") + Math.floor(elapsedTicks / 20 % 60);}
function resetTime() {elapsedTicks = 0; startTime = (elapsedSeconds = Math.floor(rise.getSystemMillis() / 1000) - startTime) > 0 ? -1 : Math.floor(rise.getSystemMillis() / 1000);}
function epicDeath() {deaths += isDead ? 1 : 0; isDead = false;}

roguethebat.handle("onTick", function () {if (inServer) updateTime();});
roguethebat.handle("onKill", function () {kills++;});
roguethebat.handle("onServerKick", function () {resetTime(), epicDeath();});
roguethebat.handle("onPreUpdate", function () {if (player.isDead() && !isDead) deaths++, isDead = true;});
roguethebat.handle("onGameEvent", function () {inServer = network.isMultiplayer() || network.isSingleplayer(); if (!inServer) resetTime(), kills = 0, deaths = 0;});

roguethebat.handle("onRender2D", function () {
  var fontolotl = render.getMinecraftFontRenderer();
  var elapsedTime = "Elapsed time: " + getTime();
  var kdRatio = roguethebat.getSetting("Kill/Death Ratio") ? (deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2)) : null;
  var username = roguethebat.getSetting("Username") ? "Username: " + player.getDisplayName() : null;
  var lineHeight = fontolotl.height();
  var lineSpacing = lineHeight * 0.5;
  var rectPadding = 5;
  var rectWidth = Math.max(fontolotl.width("Session info"), fontolotl.width(elapsedTime + "    "), roguethebat.getSetting("Username") ? fontolotl.width(username) : null, roguethebat.getSetting("Username") ? fontolotl.width("KD Ratio: " + kdRatio) : null, fontolotl.width("Kills " + kills)) + (roguethebat.getSetting("Username") ? (Math.random() <= 0.1 ? 6.1 : 6) : null) + roguethebat.getSetting("Additional Wideness");
  var rectHeight = roguethebat.getSetting("Kill/Death Ratio") ? (roguethebat.getSetting("Username") ? lineHeight * 4.75 + rectPadding * 5.75 : lineHeight * 3.8 + rectPadding * 4.8) : (roguethebat.getSetting("Username") ? lineHeight * 3.6 + rectPadding * 4.6 : lineHeight * 2.7 + rectPadding * 3.7);
  var rectX = roguethebat.getSetting("X");
  var rectY = roguethebat.getSetting("Y");
  var sectionYOffset = lineHeight * (roguethebat.getSetting("Kill/Death Ratio") ? (roguethebat.getSetting("Username") ? -0.35 : 0.55) : (roguethebat.getSetting("Username") ? 0.25 : 0.55));
  var themeColor = render.getThemeColor();

  render.bloom(function () {render.roundedRectangle(rectX - rectWidth / 2, rectY - rectHeight / 2, rectWidth, rectHeight, 7, render.getThemeColor());});
  render.roundedRectangle(rectX - rectWidth / 2, rectY - rectHeight / 2, rectWidth, rectHeight, 7, [0, 0, 0, 100]);
  fontolotl.drawWithShadow("Session info", rectX - fontolotl.width("Session info") / 2, rectY - rectHeight / 2 + rectPadding, [255, 255, 255, 255]);
  if (roguethebat.getSetting("Bar")) render.rectangle(rectX - rectWidth / 2, rectY - lineHeight * (roguethebat.getSetting("Kill/Death Ratio") ? (roguethebat.getSetting("Username") ? 2.35 : 1.55) : (roguethebat.getSetting("Username") ? 1.55 : 0.9)), rectWidth, 2, themeColor);

  fontolotl.drawWithShadow("Elapsed time: " + getTime(), rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 2 + rectPadding + sectionYOffset * (roguethebat.getSetting("Kill/Death Ratio") ? 1 : 2.05), [255, 255, 255, 255]);
  roguethebat.getSetting("Kill/Death Ratio") ? (roguethebat.getSetting("Username") ? (fontolotl.drawWithShadow(username, rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 1 + rectPadding + sectionYOffset + lineSpacing, [255, 255, 255, 255]), fontolotl.drawWithShadow("KD Ratio: " + kdRatio, rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 1 + rectPadding + sectionYOffset + lineSpacing * 4, [255, 255, 255, 255])) : fontolotl.drawWithShadow("KD Ratio: " + kdRatio, rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 1 + rectPadding + sectionYOffset + lineSpacing, [255, 255, 255, 255])) : (roguethebat.getSetting("Username") ? fontolotl.drawWithShadow(username, rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 1 + rectPadding + sectionYOffset + lineSpacing * 1, [255, 255, 255, 255]) : null);
  fontolotl.drawWithShadow("Kills: " + kills, rectX - rectWidth / 2 + rectPadding, rectY - lineHeight * 0.5 + rectPadding + sectionYOffset + lineSpacing * (roguethebat.getSetting("Kill/Death Ratio") ? (roguethebat.getSetting("Username") ? 6 : 3) : (roguethebat.getSetting("Username") ? 2.85 : 1.05)), [255, 255, 255, 255]);
});
