-- Creator Analytics Hooks
-- Provides simple event logging wrappers.

local Analytics = {}

function Analytics.log(eventName, payload)
	payload = payload or {}
	payload.timestamp = DateTime.now().UnixTimestampMillis
	print(("[Analytics] %s :: %s"):format(eventName, game:GetService("HttpService"):JSONEncode(payload)))
end

return Analytics
