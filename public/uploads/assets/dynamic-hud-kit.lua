-- Dynamic HUD Kit
-- Sample UI binding helpers for Roblox Studio creators.

local HudKit = {}

function HudKit.mount(playerGui)
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "DynamicHUD"
	screenGui.ResetOnSpawn = false
	screenGui.Parent = playerGui

	local label = Instance.new("TextLabel")
	label.Name = "QuestTracker"
	label.Size = UDim2.new(0, 300, 0, 120)
	label.Position = UDim2.new(0, 24, 0, 40)
	label.BackgroundTransparency = 0.2
	label.BackgroundColor3 = Color3.fromRGB(18, 40, 90)
	label.TextColor3 = Color3.new(1, 1, 1)
	label.Font = Enum.Font.GothamMedium
	label.TextWrapped = true
	label.Text = "No active quests."
	label.Parent = screenGui

	return screenGui
end

function HudKit.updateQuest(screenGui, text)
	local tracker = screenGui:FindFirstChild("QuestTracker")
	if tracker then
		tracker.Text = text
	end
end

return HudKit
