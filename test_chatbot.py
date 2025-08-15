#!/usr/bin/env python3
"""
Test script for AI Customer Support Chatbot
Demonstrates functionality and tests API endpoints
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
TEST_MESSAGES = [
    "Hello, I need help with my account",
    "I'm experiencing a technical issue with the app",
    "How much does the premium plan cost?",
    "I want to cancel my subscription",
    "Can you tell me about your return policy?",
    "I have a complaint about customer service",
    "What features are included in the basic plan?",
    "I'd like to provide feedback about your service"
]

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data['status']} | Uptime: {data['uptime']}")
            return True
        else:
            print(f"❌ Health Check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check error: {e}")
        return False

def test_analytics():
    """Test the analytics endpoint"""
    print("\n📊 Testing Analytics...")
    try:
        response = requests.get(f"{BASE_URL}/api/analytics")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Analytics retrieved successfully")
            print(f"   Total Queries: {data.get('total_queries', 'N/A')}")
            print(f"   Avg Response Time: {data.get('average_response_time', 'N/A')}")
            print(f"   Performance Gain: {data.get('response_time_reduction', 'N/A')}")
            print(f"   Uptime: {data.get('uptime_percentage', 'N/A')}")
            return True
        else:
            print(f"❌ Analytics failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Analytics error: {e}")
        return False

def test_chat_endpoint(message, context=None):
    """Test the chat endpoint with a specific message"""
    try:
        payload = {
            "message": message,
            "context": context or []
        }
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        end_time = time.time()
        
        if response.status_code == 200:
            data = response.json()
            api_response_time = data.get('response_time', 0)
            actual_response_time = end_time - start_time
            
            print(f"✅ Message: '{message[:50]}{'...' if len(message) > 50 else ''}'")
            print(f"   Response: {data.get('response', 'N/A')[:100]}{'...' if len(data.get('response', '')) > 100 else ''}")
            print(f"   Intent: {data.get('intent', 'N/A')}")
            print(f"   API Response Time: {api_response_time:.3f}s")
            print(f"   Actual Response Time: {actual_response_time:.3f}s")
            print(f"   Query ID: {data.get('query_id', 'N/A')}")
            
            return data
        else:
            print(f"❌ Chat failed for '{message[:30]}...': {response.status_code}")
            if response.text:
                print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Chat error for '{message[:30]}...': {e}")
        return None

def test_conversation_flow():
    """Test a conversation flow with context"""
    print("\n💬 Testing Conversation Flow...")
    
    conversation_context = []
    
    for i, message in enumerate(TEST_MESSAGES[:3]):  # Test first 3 messages
        print(f"\n--- Message {i+1} ---")
        response = test_chat_endpoint(message, conversation_context)
        
        if response:
            # Add to conversation context for next message
            conversation_context.append({
                "role": "user",
                "content": message
            })
            conversation_context.append({
                "role": "assistant", 
                "content": response.get('response', '')
            })
            
            # Keep only last 6 messages in context (3 exchanges)
            if len(conversation_context) > 6:
                conversation_context = conversation_context[-6:]
        
        time.sleep(1)  # Small delay between requests

def test_rate_limiting():
    """Test rate limiting by sending multiple rapid requests"""
    print("\n⚡ Testing Rate Limiting...")
    
    rapid_messages = ["Test message"] * 10
    
    for i, message in enumerate(rapid_messages):
        response = test_chat_endpoint(message)
        if response is None:
            print(f"   Rate limit hit after {i+1} rapid requests")
            break
        time.sleep(0.1)  # Very small delay

def test_error_handling():
    """Test error handling with invalid requests"""
    print("\n🚨 Testing Error Handling...")
    
    # Test empty message
    print("   Testing empty message...")
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": "", "context": []},
        headers={"Content-Type": "application/json"}
    )
    if response.status_code == 400:
        print("   ✅ Empty message properly rejected")
    else:
        print(f"   ❌ Empty message not rejected: {response.status_code}")
    
    # Test missing message field
    print("   Testing missing message field...")
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"context": []},
        headers={"Content-Type": "application/json"}
    )
    if response.status_code == 400:
        print("   ✅ Missing message field properly rejected")
    else:
        print(f"   ❌ Missing message field not rejected: {response.status_code}")
    
    # Test invalid JSON
    print("   Testing invalid JSON...")
    response = requests.post(
        f"{BASE_URL}/api/chat",
        data="invalid json",
        headers={"Content-Type": "application/json"}
    )
    if response.status_code == 400:
        print("   ✅ Invalid JSON properly rejected")
    else:
        print(f"   ❌ Invalid JSON not rejected: {response.status_code}")

def run_performance_test():
    """Run a performance test with multiple concurrent requests"""
    print("\n🚀 Running Performance Test...")
    
    import concurrent.futures
    import threading
    
    results = []
    lock = threading.Lock()
    
    def send_request(message):
        start_time = time.time()
        try:
            response = requests.post(
                f"{BASE_URL}/api/chat",
                json={"message": message, "context": []},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            end_time = time.time()
            
            with lock:
                results.append({
                    "message": message,
                    "response_time": end_time - start_time,
                    "status_code": response.status_code,
                    "success": response.status_code == 200
                })
                
        except Exception as e:
            with lock:
                results.append({
                    "message": message,
                    "response_time": 0,
                    "status_code": 0,
                    "success": False,
                    "error": str(e)
                })
    
    # Send 5 concurrent requests
    test_messages = [f"Performance test message {i}" for i in range(5)]
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(send_request, test_messages)
    
    # Analyze results
    successful_requests = [r for r in results if r['success']]
    failed_requests = [r for r in results if not r['success']]
    
    if successful_requests:
        avg_response_time = sum(r['response_time'] for r in successful_requests) / len(successful_requests)
        print(f"   ✅ Successful requests: {len(successful_requests)}")
        print(f"   📊 Average response time: {avg_response_time:.3f}s")
        print(f"   📈 Best response time: {min(r['response_time'] for r in successful_requests):.3f}s")
        print(f"   📉 Worst response time: {max(r['response_time'] for r in successful_requests):.3f}s")
    
    if failed_requests:
        print(f"   ❌ Failed requests: {len(failed_requests)}")
        for req in failed_requests:
            print(f"      - {req.get('error', 'Unknown error')}")

def main():
    """Main test function"""
    print("🤖 AI Customer Support Chatbot - Test Suite")
    print("=" * 50)
    print(f"Testing against: {BASE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # Check if server is running
    if not test_health_check():
        print("\n❌ Server is not running. Please start the chatbot first.")
        print("   Run: python app.py")
        return
    
    # Run tests
    test_analytics()
    test_conversation_flow()
    test_rate_limiting()
    test_error_handling()
    run_performance_test()
    
    # Final analytics check
    print("\n📊 Final Analytics Check...")
    test_analytics()
    
    print("\n🎉 Test suite completed!")
    print("\nTo view the chatbot interface, visit:")
    print(f"   {BASE_URL}")
    print("\nTo monitor performance, check the analytics panel on the right side.")

if __name__ == "__main__":
    main()
