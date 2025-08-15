#!/usr/bin/env python3
"""
AI Customer Support Chatbot - Demo Script
Demonstrates the chatbot functionality in a simple console interface
"""

import os
import sys
import time
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the chatbot class
try:
    from app import AIChatbot
except ImportError:
    print("❌ Error: Could not import chatbot. Make sure you're in the correct directory.")
    sys.exit(1)

def print_header():
    """Print the demo header"""
    print("🤖 AI Customer Support Chatbot - Console Demo")
    print("=" * 50)
    print("This demo showcases the chatbot's capabilities")
    print("Type 'quit' to exit, 'help' for commands")
    print("=" * 50)
    print()

def print_help():
    """Print help information"""
    print("\n📚 Available Commands:")
    print("  help          - Show this help message")
    print("  quit/exit     - Exit the demo")
    print("  analytics     - Show performance metrics")
    print("  test          - Run automated test scenarios")
    print("  clear         - Clear the conversation")
    print("  <any text>    - Send a message to the chatbot")
    print()

def run_test_scenarios(chatbot):
    """Run automated test scenarios"""
    print("\n🧪 Running Test Scenarios...")
    
    test_scenarios = [
        "Hello, I need help with my account",
        "I'm experiencing a technical issue with the app",
        "How much does the premium plan cost?",
        "I want to cancel my subscription",
        "Can you tell me about your return policy?",
        "I have a complaint about customer service",
        "What features are included in the basic plan?",
        "I'd like to provide feedback about your service"
    ]
    
    for i, message in enumerate(test_scenarios, 1):
        print(f"\n--- Test {i}: {message} ---")
        
        # Simulate user input
        print(f"👤 User: {message}")
        
        # Get chatbot response
        start_time = time.time()
        response = chatbot.generate_response(message)
        end_time = time.time()
        
        # Display response
        print(f"🤖 Bot: {response['response']}")
        print(f"   Intent: {response['intent']}")
        print(f"   Response Time: {response['response_time']:.3f}s")
        print(f"   Query ID: {response['query_id']}")
        
        # Small delay between tests
        time.sleep(1)
    
    print(f"\n✅ Completed {len(test_scenarios)} test scenarios!")

def show_analytics(chatbot):
    """Show chatbot analytics"""
    print("\n📊 Chatbot Analytics:")
    analytics = chatbot.get_analytics()
    
    if 'error' in analytics:
        print("   No data available yet")
        return
    
    print(f"   Total Queries: {analytics.get('total_queries', 0)}")
    print(f"   Average Response Time: {analytics.get('average_response_time', 0):.3f}s")
    print(f"   Performance Gain: {analytics.get('response_time_reduction', 'N/A')}")
    print(f"   Conversations Stored: {analytics.get('conversations_stored', 0)}")
    print(f"   Uptime: {analytics.get('uptime_percentage', 'N/A')}")
    print(f"   Last Updated: {analytics.get('last_updated', 'N/A')}")

def interactive_chat(chatbot):
    """Run interactive chat session"""
    print("\n💬 Interactive Chat Mode")
    print("Type your messages below. The chatbot will respond in real-time.")
    print("Type 'quit' to exit, 'help' for commands.")
    print("-" * 50)
    
    conversation_context = []
    
    while True:
        try:
            # Get user input
            user_input = input("\n👤 You: ").strip()
            
            # Check for commands
            if user_input.lower() in ['quit', 'exit']:
                print("👋 Goodbye! Thanks for trying the AI chatbot.")
                break
            elif user_input.lower() == 'help':
                print_help()
                continue
            elif user_input.lower() == 'analytics':
                show_analytics(chatbot)
                continue
            elif user_input.lower() == 'test':
                run_test_scenarios(chatbot)
                continue
            elif user_input.lower() == 'clear':
                conversation_context = []
                print("🗑️  Conversation history cleared")
                continue
            elif not user_input:
                print("⚠️  Please enter a message")
                continue
            
            # Process the message
            print("🤖 Bot is thinking...")
            
            # Get chatbot response
            start_time = time.time()
            response = chatbot.generate_response(user_input, conversation_context)
            end_time = time.time()
            
            # Display response
            print(f"🤖 Bot: {response['response']}")
            print(f"   Intent: {response['intent']}")
            print(f"   Response Time: {response['response_time']:.3f}s")
            print(f"   Query ID: {response['query_id']}")
            
            # Update conversation context
            conversation_context.append({
                "role": "user",
                "content": user_input
            })
            conversation_context.append({
                "role": "assistant",
                "content": response['response']
            })
            
            # Keep only last 10 messages in context
            if len(conversation_context) > 10:
                conversation_context = conversation_context[-10:]
                
        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            print("Please try again or type 'quit' to exit")

def main():
    """Main demo function"""
    print_header()
    
    # Initialize the chatbot
    print("🔧 Initializing AI Chatbot...")
    try:
        chatbot = AIChatbot()
        print("✅ Chatbot initialized successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize chatbot: {e}")
        print("Make sure all dependencies are installed and configured correctly.")
        return
    
    # Show initial analytics
    show_analytics(chatbot)
    
    # Show help
    print_help()
    
    # Start interactive chat
    interactive_chat(chatbot)
    
    # Final analytics
    print("\n📊 Final Analytics:")
    show_analytics(chatbot)
    
    print("\n🎉 Demo completed!")
    print("\nTo run the full web interface:")
    print("   python app.py")
    print("   Then visit: http://localhost:5000")

if __name__ == "__main__":
    main()
