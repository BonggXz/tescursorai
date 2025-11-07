-- Creator Onboarding Kit
-- Simple helper to show onboarding prompts.

local Onboarding = {}

function Onboarding.prompt(player, message)
	local dialog = Instance.new("Hint")
	dialog.Text = message
	dialog.Parent = player:FindFirstChildWhichIsA("PlayerGui")
	task.delay(6, function()
		dialog:Destroy()
	end)
end

return Onboarding
