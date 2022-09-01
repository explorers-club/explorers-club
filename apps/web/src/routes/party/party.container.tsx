import { PartyComponent } from './party.component';
// import { createPartyMachine } from './party.machine';

type RouteParams = {
  code: string;
};

// const selectPartyActor = createSelector(
//   selectAppContext,
//   (context) => context.partyActorRef
// );

export function Party() {
  // const appService = useContext(AppServiceContext);
  // const partyActor = useSelector(appService, selectPartyActor);
  // const { code } = useParams<RouteParams>() as RouteParams;
  // useInterpret(appService)

  // useEffect(() => {
  //   console.log("sending join event")
  //   partyActor.send(partyModel.events.JOIN(code));
  // }, [partyActor, code]);

  return <PartyComponent />;
  // const authService = useContext(AuthServiceContext);
  // const { code } = useParams<RouteParams>() as RouteParams;

  // const machine = useMemo(() => createPartyMachine({ code }), [code]);
  // const partyService = useInterpret(machine);

  // return (
  //   <PartyServiceContext.Provider value={partyService}>
  //     <PartyComponent />
  //   </PartyServiceContext.Provider>
  // );
}
