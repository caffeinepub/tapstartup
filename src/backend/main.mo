import Text "mo:core/Text";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  let admin = Principal.fromText("2vxsx-fae");

  let subscriberSet = Set.singleton("seed@icp.land");

  public shared ({ caller = _ }) func addSubscriber(email : Text) : async () {
    if (subscriberSet.contains(email)) {
      Runtime.trap("Email already subscribed.");
    };
    subscriberSet.add(email);
  };

  public shared ({ caller }) func getAllSubscribers() : async [Text] {
    if (caller != admin) { Runtime.trap("Only admin can access all subscribers.") };
    subscriberSet.values().toArray();
  };

  // HTTP handler for ICP custom domain verification
  public query func http_request(req : { url : Text; method : Text; headers : [(Text, Text)]; body : Blob }) : async {
    status_code : Nat16;
    headers : [(Text, Text)];
    body : Blob;
    upgrade : ?Bool;
  } {
    if (req.url == "/.well-known/ic-domains" or req.url == "/.well-known/ic-domains/") {
      {
        status_code = 200;
        headers = [("Content-Type", "text/plain")];
        body = ("www.kwtd.eu").encodeUtf8();
        upgrade = ?false;
      }
    } else {
      {
        status_code = 404;
        headers = [("Content-Type", "text/plain")];
        body = ("Not found").encodeUtf8();
        upgrade = ?false;
      }
    }
  };
};
