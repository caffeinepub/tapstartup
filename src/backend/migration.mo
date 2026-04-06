import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type OldPersistentActor = {
    admin : Principal;
    subscriberSet : Set.Set<Text>;
  };

  type NewPersistentActor = {
    admin : Principal;
    subscribers : Set.Set<Text>;
  };

  // Migrate subscriberSet to subscribers
  public func run(old : OldPersistentActor) : NewPersistentActor {
    {
      old with
      subscribers = old.subscriberSet;
    };
  };
};
