-- Questline Graph Engine
-- Evaluate quest graphs with prerequisites.

local Graph = {}
Graph.__index = Graph

function Graph.new(nodes)
	return setmetatable({
		nodes = nodes or {},
		state = {},
	}, Graph)
end

function Graph:isUnlocked(id)
	local node = self.nodes[id]
	if not node then
		return false
	end

	for _, dependency in ipairs(node.requires or {}) do
		if not self.state[dependency] then
			return false
		end
	end
	return true
end

function Graph:complete(id)
	if self:isUnlocked(id) then
		self.state[id] = true
		return true
	end
	return false
end

return Graph
