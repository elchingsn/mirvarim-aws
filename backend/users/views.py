from django.views.generic import View
from django.contrib.auth import get_user_model
import base64
import hashlib
import hmac

class DataDeletionView(View):
    
    def post(self, request, *args, **kwargs):
        try:
            signed_request = request.POST['signed_request']
            encoded_sig, payload = signed_request.split('.')
        except (ValueError, KeyError):
            return HttpResponse(status=400, content='Invalid request')
 
        try:
            # Reference for request decoding: https://developers.facebook.com/docs/games/gamesonfacebook/login#parsingsr
            # For some reason, the request needs to be padded in order to be decoded. See https://stackoverflow.com/a/6102526/2628463
            decoded_payload = base64.urlsafe_b64decode(payload + "==").decode('utf-8')
            decoded_payload = json.loads(decoded_payload)
 
            if type(decoded_payload) is not dict or 'user_id' not in decoded_payload.keys():
                return HttpResponse(status=400, content='Invalid payload data')
 
        except (ValueError, json.JSONDecodeError):
            return HttpResponse(status=400, content='Could not decode payload')
 
        try:
            secret = '1a78feb9e3143fc712f9286670762e8c'
 
            sig = base64.urlsafe_b64decode(encoded_sig + "==")
            expected_sig = hmac.new(bytes(secret, 'utf-8'), bytes(payload, 'utf-8'), hashlib.sha256)
        except:
            return HttpResponse(status=400, content='Could not decode signature')
 
        if not hmac.compare_digest(expected_sig.digest(), sig):
            return HttpResponse(status=400, content='Invalid request')
 
        user_id = decoded_payload['user_id']
 
        try:
            user_account = get_user_model().objects.get(key=user_id)
        except FacebookLoginDetails.DoesNotExist:
            return HttpResponse(status=200)
 
        user_account.delete()
 
        return HttpResponse(status=200)
        