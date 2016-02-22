import hashlib
import hmac
import random
import time as gtime

def getRandomData(amt):
    chars = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTUIOPASDFGHJKLZXCVBNM"
    return "".join([random.choice(x) for x in [chars] * amt])

hmac_key = "KYRjgSHKmi5J21MsoDXabCsgGL80WdrxZcaFapCDvKQTvyw1CNxRqqud90G0dpl2"

# TODO: Having "%s%s" % (self.msg, self.time) or some variant thereof in 5 million places is hideous.
class ProofOfWorkRequest:
    def __init__(self, prefix, mac, time):
        self.prefix = prefix
        self.mac = mac
        self.time = time
    def isValid(self):
        dgst = hmac.new(hmac_key, "%s%s" % (self.prefix, self.time), hashlib.sha384).hexdigest()
        # TODO: SECURITY: Timing attacks
        if dgst != self.mac:
            return (False, "Invalid MAC")
        elif gtime.time() - self.time > 60:
            return (False, "Expired")
        return (True, None)
    def getJson(self):
        return {
            "prefix": self.prefix,
            "mac": self.mac,
            "time": self.time
        }
    @staticmethod
    def generate():
        prefix = getRandomData(32)
        time = int(gtime.time())
        return ProofOfWorkRequest(prefix, hmac.new(hmac_key, "%s%s" % (prefix, time), hashlib.sha384).hexdigest(), time)
    @staticmethod
    def fromJson(json):
        return ProofOWorkRequest(json["prefix"], json["mac"], json["time"])

class ProofOfWorkResponse(ProofOfWorkRequest):
    def __init__(self, prefix, mac=None, time=None, suffix=None):
    	if type(prefix) is dict:
    		prefix, mac, time, suffix = prefix["prefix"], prefix["mac"], prefix["time"], prefix["suffix"]
        ProofOfWorkRequest.__init__(self, prefix, mac, time)
        self.suffix = suffix
    def getJson(self):
        return {
            "prefix": self.prefix,
            "mac": self.mac,
            "time": self.time,
            "suffix": self.suffix
        }
    def isValid(self):
        superValid, superReason = ProofOfWorkRequest.isValid(self)
        if not superValid:
            return (superValid, superReason)
        if hashlib.sha384("%s%s" % (self.prefix, self.suffix)).hexdigest()[:4] != "0000":
            return (False, "Invalid hash.")
        return (True, None)
    @staticmethod
    def fromJson(json):
        return ProofOfWorkResponse(json["prefix"], json["mac"], json["time"], json["suffix"])
    @staticmethod
    def fromRequest(req, suffix):
        return ProofOfWorkResponse(req.prefix, req.mac, req.time, suffix)
