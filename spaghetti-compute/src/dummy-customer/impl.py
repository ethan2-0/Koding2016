import server
import hashlib

digitsWanted = 5

def sha1(x):
    return hashlib.sha1(x).hexdigest()

class MainHandler:
    def __init__(self):
        pass
    def getWorkUnit(self):
        return server.WorkUnit(server.getRandomData(32))
    def handleWorkUnit(self, workunit):
    	print "Got handleWorkUnit() call"
        if sha1(workunit.response)[:digitsWanted] == "0" * digitsWanted:
            print "Found correct server: %s" % workunit.response
        else:
            print "Invalid sha1! %s" % sha1(workunit.response)

server.setWorkUnitImpl(MainHandler())
server.run()