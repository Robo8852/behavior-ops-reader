import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_creation")
      .order("asc")
      .take(50)
    return messages
  },
})

export const sendMessage = mutation({
  args: {
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      role: args.role,
      pageNumber: args.pageNumber,
      createdAt: Date.now(),
    })
    return messageId
  },
})

export const clearMessages = mutation({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect()
    for (const message of messages) {
      await ctx.db.delete(message._id)
    }
  },
})
