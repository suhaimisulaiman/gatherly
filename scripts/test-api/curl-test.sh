#!/usr/bin/env bash
# Test invitation APIs with curl. Requires COOKIE env var (from browser DevTools).
# Usage: COOKIE="sb-xxx-auth-token=..." ./scripts/test-api/curl-test.sh

set -e
BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE="${COOKIE:-}"

if [ -z "$COOKIE" ]; then
  echo "Set COOKIE env var (copy from DevTools → Application → Cookies after logging in)"
  echo "Example: COOKIE=\"sb-xxx-auth-token=eyJ...\" $0"
  exit 1
fi

echo "Testing $BASE_URL"
echo ""

echo "1. POST /api/v1/invitations (create draft)..."
CREATE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/invitations" \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIE" \
  -d '{"template_id":"elegant-rose","content":{"invitationTitle":"Test Wedding","hostNames":"A & B","eventDate":"2026-04-01"}}')
HTTP=$(echo "$CREATE" | tail -n1)
BODY=$(echo "$CREATE" | sed '$d')
if [ "$HTTP" != "200" ]; then
  echo "   FAIL: $HTTP — $BODY"
  exit 1
fi
ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "   OK — id: $ID"

echo ""
echo "2. GET /api/v1/invitations/$ID (load)..."
LOAD=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/invitations/$ID" -H "Cookie: $COOKIE")
HTTP=$(echo "$LOAD" | tail -n1)
BODY=$(echo "$LOAD" | sed '$d')
if [ "$HTTP" != "200" ]; then
  echo "   FAIL: $HTTP — $BODY"
  exit 1
fi
echo "   OK"

echo ""
echo "3. POST /api/v1/invitations/$ID/publish..."
PUB=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/invitations/$ID/publish" -H "Cookie: $COOKIE")
HTTP=$(echo "$PUB" | tail -n1)
BODY=$(echo "$PUB" | sed '$d')
if [ "$HTTP" != "200" ]; then
  echo "   FAIL: $HTTP — $BODY"
  exit 1
fi
SLUG=$(echo "$BODY" | grep -o '"slug":"[^"]*"' | cut -d'"' -f4)
echo "   OK — slug: $SLUG"

echo ""
echo "All tests passed. Share URL: /i/$SLUG"
