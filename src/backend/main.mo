import Text "mo:core/Text";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  let admin = Principal.fromText("2vxsx-fae");

  let subscriberSet = Set.singleton("seed@icp.land");

  public shared ({ caller }) func addSubscriber(email : Text) : async () {
    if (subscriberSet.contains(email)) {
      Runtime.trap("Email already subscribed.");
    };
    subscriberSet.add(email);
  };

  public shared ({ caller }) func getAllSubscribers() : async [Text] {
    if (caller != admin) { Runtime.trap("Only admin can access all subscribers.") };
    subscriberSet.values().toArray();
  };
};
